import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { OrderItem, Supply, Order } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { SupplyEntity } from '../supplies/entities';
import { OrderEntity } from '../orders/entities';

import { OrderItemEntity } from './entities';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto';

class EnhancedOrderItem extends OrderItemEntity {
  supply: SupplyEntity;
  order: OrderEntity;
}

type CreateEnhancedOrderItem = OrderItem & {
  supply: Supply;
  order: Order;
};

@Controller()
@UseGuards(PoliciesGuard)
export class OrdersItemsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedOrderItem({
    order,
    supply,
    ...rest
  }: CreateEnhancedOrderItem): EnhancedOrderItem {
    const item = new EnhancedOrderItem(rest);
    item.supply = new SupplyEntity(supply);
    item.order = new OrderEntity(order);

    return item;
  }

  @Post('warehouse/orders/:order_id/items')
  @CheckPolicies((ability) => ability.can('create', 'orderItem'))
  async create(
    @Param('order_id') orderId: UUID,
    @Body() createItemDto: CreateOrderItemDto
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const item = await this.prismaService.orderItem.create({
      data: {
        price: createItemDto.price,
        quantity: createItemDto.quantity,
        supply: { connect: { id: createItemDto.supply } },
        order: { connect: { id: orderId } },
      },
      include: { order: true, supply: true },
    });

    return this.createEnhancedOrderItem(item);
  }

  @Get('warehouse/orders/:order_id/items/count')
  @CheckPolicies((ability) => ability.can('count', 'orderItem'))
  async count(@Param('order_id') orderId: UUID): Promise<number> {
    return await this.prismaService.orderItem.count({
      where: { order: { id: orderId } },
    });
  }

  @Get('warehouse/orders/:order_id/items')
  @CheckPolicies((ability) => ability.can('read', 'orderItem'))
  async findAll(
    @Param('order_id') orderId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedOrderItem>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.orderItem.findMany({
        where: { order: { id: orderId } },
        include: { order: true, supply: true },
      }),
      this.prismaService.orderItem.count({
        where: { order: { id: orderId } },
      }),
    ]);

    return {
      count,
      entities: items.map((item) => this.createEnhancedOrderItem(item)),
    };
  }

  @Get('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can('read', 'orderItem'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrderItem | null>> {
    const item = await this.prismaService.orderItem.findUnique({
      where: { id },
      include: { order: true, supply: true },
    });

    return item ? this.createEnhancedOrderItem(item) : null;
  }

  @Patch('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can('update', 'orderItem'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateItemDto: UpdateOrderItemDto
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const item = await this.prismaService.orderItem.update({
      where: { id },
      data: {
        price: updateItemDto.price,
        quantity: updateItemDto.quantity,
        received: updateItemDto.received,
      },
      include: { order: true, supply: true },
    });

    return this.createEnhancedOrderItem(item);
  }

  @Delete('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can('delete', 'orderItem'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const item = await this.prismaService.orderItem.delete({
      where: { id },
      include: { order: true, supply: true },
    });

    return this.createEnhancedOrderItem(item);
  }
}

export default OrdersItemsController;
