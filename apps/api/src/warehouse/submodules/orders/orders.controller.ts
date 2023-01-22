import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Order, OrderItem, Supply, Supplier } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { OrderItemEntity } from '../orders-items/entities';
import { SupplyEntity } from '../supplies/entities';
import { SupplierEntity } from '../suppliers/entities';

import { OrderEntity } from './entities';
import {
  FindManyOrdersParamsDto,
  CountOrdersParamsDto,
  CreateOrderDto,
  UpdateOrderDto,
  ReceiveOrderItemsDto,
} from './dto';
import { InvalidReceivedQuantityException } from './errors';

class EnhancedOrderItem extends OrderItemEntity {
  supply: SupplyEntity;
}

class EnhancedOrder extends OrderEntity {
  items: EnhancedOrderItem[];
  supplier: SupplierEntity;
}

type CreateEnhancedOrder = Order & {
  items: (OrderItem & { supply: Supply })[];
  supplier: Supplier;
};

@Controller('warehouse/orders')
@UseGuards(PoliciesGuard)
export class OrdersController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedOrder({
    items,
    supplier,
    ...rest
  }: CreateEnhancedOrder): EnhancedOrder {
    const order = new EnhancedOrder(rest);

    order.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedOrderItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    order.supplier = new SupplierEntity(supplier);

    return order;
  }

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'order'))
  async create(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.create({
      data: {
        code: createOrderDto.code,
        supplier: { connect: { id: createOrderDto.supplier } },
        items: {
          createMany: {
            skipDuplicates: true,
            data: createOrderDto.items.map((item) => ({
              price: item.price,
              quantity: item.quantity,
              supplyId: item.supply,
            })),
          },
        },
      },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    return this.createEnhancedOrder(order);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'order'))
  async count(@Query() query: CountOrdersParamsDto): Promise<number> {
    return await this.prismaService.order.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findMany(
    @Query() query: FindManyOrdersParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedOrder>> {
    const [orders, count] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { items: { include: { supply: true } }, supplier: true },
      }),
      this.prismaService.order.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: orders.map((order) => this.createEnhancedOrder(order)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder | null>> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    return order ? this.createEnhancedOrder(order) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'order'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        code: updateOrderDto.code,
        status: updateOrderDto.status,
      },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    return this.createEnhancedOrder(order);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'order'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.delete({
      where: { id },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    return this.createEnhancedOrder(order);
  }

  @Patch(':id/receive-items') // TODO: check?
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'order'))
  async receiveItems(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() receiveOrderItemsDto: ReceiveOrderItemsDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.findUniqueOrThrow({
        where: { id },
        include: { items: { include: { supply: true } }, supplier: true },
      });

      const received = order.items.reduce<Record<UUID, number>>(
        (prev, current) => ({
          ...prev,
          [current.id]:
            receiveOrderItemsDto.received.find(
              (target) => target.item === current.id
            )?.quantity ?? 0,
        }),
        {}
      );

      const targets = order.items.map((item) => {
        const remaining =
          item.quantity -
          item.received.reduce((total, current) => total + current, 0);

        if (received[item.id] > remaining)
          throw new InvalidReceivedQuantityException(
            item.supply.name,
            remaining,
            received[item.id]
          );

        return {
          item: item.id,
          supply: item.supply.id,
          quantity: item.quantity,
          received: received[item.id],
          remaining,
        };
      });

      await Promise.all(
        targets.map(async (target) => {
          const allItemsDelivered = target.remaining - target.received === 0;

          const someItemDelivered =
            target.quantity !== target.remaining - target.received;

          await tx.orderItem.update({
            where: { id: target.item },
            data: {
              received: { push: target.received },

              deliveryStatus: allItemsDelivered
                ? 'COMPLETED'
                : someItemDelivered
                ? 'PARTIAL'
                : 'PENDING',

              supply: {
                update: {
                  quantity: {
                    increment: target.received,
                  },
                },
              },
            },
          });
        })
      );

      // TODO: implement it correctly
      await tx.inventoryMovement.create({
        data: {
          type: 'INPUT',
          order: { connect: { id: order.id } },
          items: {
            createMany: {
              skipDuplicates: true,
              data: targets.map((target) => ({
                quantity: target.received,
                supplyId: target.supply,
              })),
            },
          },
        },
      });

      const allItemsDelivered = targets.every(
        ({ received, remaining }) => remaining - received === 0
      );

      return await tx.order.update({
        where: { id },
        data: {
          status: allItemsDelivered ? 'COMPLETED' : 'PARTIAL',
          deliveryAt: { push: new Date() },
        },
        include: { items: { include: { supply: true } }, supplier: true },
      });
    });

    return this.createEnhancedOrder(order);
  }
}

export default OrdersController;
