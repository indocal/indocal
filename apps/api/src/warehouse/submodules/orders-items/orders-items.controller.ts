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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import OrdersItemsService from './orders-items.service';
import { OrderItemEntity } from './entities';
import { CreateOrderItemDto, UpdateOrderItemDto } from './dto';

@Controller()
@UseGuards(PoliciesGuard)
export class OrdersItemsController {
  constructor(private ordersItemsService: OrdersItemsService) {}

  @Post('orders/:order_id/items')
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'orderItem'))
  async create(
    @Param('order_id') orderId: UUID,
    @Body() createItemDto: CreateOrderItemDto
  ): Promise<OrderItemEntity> {
    const item = await this.ordersItemsService.create(orderId, createItemDto);

    return new OrderItemEntity(item);
  }

  @Get('orders/:order_id/items/count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'orderItem'))
  async count(@Param('order_id') orderId: UUID): Promise<number> {
    return await this.ordersItemsService.count(orderId);
  }

  @Get('orders/:order_id/items')
  @CheckPolicies((ability) => ability.can(Action.READ, 'orderItem'))
  async findAll(@Param('order_id') orderId: UUID): Promise<OrderItemEntity[]> {
    const items = await this.ordersItemsService.findAll(orderId);

    return items.map((item) => new OrderItemEntity(item));
  }

  @Get('orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'orderItem'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<OrderItemEntity | null> {
    const item = await this.ordersItemsService.findUnique({ id });

    return item ? new OrderItemEntity(item) : null;
  }

  @Patch('orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'orderItem'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateItemDto: UpdateOrderItemDto
  ): Promise<OrderItemEntity> {
    const item = await this.ordersItemsService.update(id, updateItemDto);

    return new OrderItemEntity(item);
  }

  @Delete('orders/items/:id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'orderItem'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<OrderItemEntity> {
    const item = await this.ordersItemsService.delete(id);

    return new OrderItemEntity(item);
  }
}

export default OrdersItemsController;
