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
import { PrismaService } from 'nestjs-prisma';
import { Order, OrderItem, Supply, Supplier, UserGroup } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { OrderItemEntity } from '../../orders-items/entities';
import { SupplyEntity } from '../../supplies/entities';
import { SupplierEntity } from '../../suppliers/entities';
import { UserGroupEntity } from '../../../../auth/submodules/groups/entities';

import { OrderEntity } from '../entities';
import {
  FindManyOrdersParamsDto,
  CountOrdersParamsDto,
  CreateOrderDto,
  UpdateOrderDto,
} from '../dto';

class EnhancedOrderItem extends OrderItemEntity {
  supply: SupplyEntity;
}

class EnhancedOrder extends OrderEntity {
  items: EnhancedOrderItem[];
  supplier: SupplierEntity;
  requestedBy: UserGroupEntity;
}

type CreateEnhancedOrder = Order & {
  items: (OrderItem & { supply: Supply })[];
  supplier: Supplier;
  requestedBy: UserGroup;
};

@Controller('warehouse/orders')
@UseGuards(PoliciesGuard)
export class OrdersCRUDController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedOrder({
    items,
    supplier,
    requestedBy,
    ...rest
  }: CreateEnhancedOrder): EnhancedOrder {
    const order = new EnhancedOrder(rest);

    order.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedOrderItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    order.supplier = new SupplierEntity(supplier);
    order.requestedBy = new UserGroupEntity(requestedBy);

    return order;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'order'))
  async create(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.create({
      data: {
        code: createOrderDto.code,
        concept: createOrderDto.concept,
        supplier: { connect: { id: createOrderDto.supplier } },
        requestedBy: { connect: { id: createOrderDto.requestedBy } },
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
      include: {
        items: { include: { supply: true } },
        supplier: true,
        requestedBy: true,
      },
    });

    return this.createEnhancedOrder(order);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'order'))
  async count(@Query() query: CountOrdersParamsDto): Promise<number> {
    return await this.prismaService.order.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'order'))
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
        include: {
          items: { include: { supply: true } },
          supplier: true,
          requestedBy: true,
        },
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
  @CheckPolicies((ability) => ability.can('read', 'order'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder | null>> {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: {
        items: { include: { supply: true } },
        supplier: true,
        requestedBy: true,
      },
    });

    return order ? this.createEnhancedOrder(order) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'order'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.update({
      where: { id },
      data: {
        code: updateOrderDto.code,
        concept: updateOrderDto.concept,
        status: updateOrderDto.status,
      },
      include: {
        items: { include: { supply: true } },
        supplier: true,
        requestedBy: true,
      },
    });

    return this.createEnhancedOrder(order);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'order'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const order = await this.prismaService.order.delete({
      where: { id },
      include: {
        items: { include: { supply: true } },
        supplier: true,
        requestedBy: true,
      },
    });

    return this.createEnhancedOrder(order);
  }
}

export default OrdersCRUDController;
