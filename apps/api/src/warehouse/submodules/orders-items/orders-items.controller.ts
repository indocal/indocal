import {
  Controller,
  Get,
  Param,
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
}

export default OrdersItemsController;
