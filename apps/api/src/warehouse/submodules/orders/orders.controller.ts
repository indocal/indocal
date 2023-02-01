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
} from './dto';

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
            data: createOrderDto.items
              .filter((item) => item.quantity > 0)
              .map((item) => ({
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
}

export default OrdersController;
