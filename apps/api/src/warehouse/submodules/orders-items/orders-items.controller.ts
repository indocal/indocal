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

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { OrderEntity, SupplyEntity } from '@/warehouse';
import { PrismaService } from '@/prisma';

import { OrderItemEntity } from './entities';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto';

class EnhancedOrderItem extends OrderItemEntity {
  order: OrderEntity;
  supply: SupplyEntity;
}

@Controller()
@UseGuards(PoliciesGuard)
export class OrdersItemsController {
  constructor(private prismaService: PrismaService) {}

  @Post('warehouse/orders/:order_id/items')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'orderItem'))
  async create(
    @Param('order_id') orderId: UUID,
    @Body() createItemDto: CreateOrderItemDto
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const { order, supply, ...rest } =
      await this.prismaService.orderItem.create({
        data: {
          price: createItemDto.price,
          quantity: createItemDto.quantity,
          supply: { connect: { id: createItemDto.supply } },
          order: { connect: { id: orderId } },
        },
        include: { order: true, supply: true },
      });

    const item = new EnhancedOrderItem(rest);
    item.order = new OrderEntity(order);
    item.supply = new SupplyEntity(supply);

    return item;
  }

  @Get('warehouse/orders/:order_id/items/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'orderItem'))
  async count(@Param('order_id') orderId: UUID): Promise<number> {
    return await this.prismaService.orderItem.count({
      where: { order: { id: orderId } },
    });
  }

  @Get('warehouse/orders/:order_id/items')
  @CheckPolicies((ability) => ability.can(Action.READ, 'orderItem'))
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
      entities: items.map(({ order, supply, ...rest }) => {
        const item = new EnhancedOrderItem(rest);
        item.order = new OrderEntity(order);
        item.supply = new SupplyEntity(supply);

        return item;
      }),
    };
  }

  @Get('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'orderItem'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrderItem | null>> {
    const response = await this.prismaService.orderItem.findUnique({
      where: { id },
      include: { order: true, supply: true },
    });

    if (!response) return null;

    const { order, supply, ...rest } = response;

    const item = new EnhancedOrderItem(rest);
    item.order = new OrderEntity(order);
    item.supply = new SupplyEntity(supply);

    return item;
  }

  @Patch('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'orderItem'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateItemDto: UpdateOrderItemDto
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const { order, supply, ...rest } =
      await this.prismaService.orderItem.update({
        where: { id },
        data: {
          price: updateItemDto.price,
          quantity: updateItemDto.quantity,
          received: updateItemDto.received,
        },
        include: { order: true, supply: true },
      });

    const item = new EnhancedOrderItem(rest);
    item.order = new OrderEntity(order);
    item.supply = new SupplyEntity(supply);

    return item;
  }

  @Delete('warehouse/orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'orderItem'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrderItem>> {
    const { order, supply, ...rest } =
      await this.prismaService.orderItem.delete({
        where: { id },
        include: { order: true, supply: true },
      });

    const item = new EnhancedOrderItem(rest);
    item.order = new OrderEntity(order);
    item.supply = new SupplyEntity(supply);

    return item;
  }
}

export default OrdersItemsController;
