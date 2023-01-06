import { Exclude } from 'class-transformer';
import { OrderItem, OrderItemDeliveryStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class OrderItemEntity implements Entity, OrderItem {
  constructor(item: OrderItem) {
    Object.assign(this, item);
  }

  id: UUID;
  price: number;
  quantity: number;
  received: number[];
  deliveryStatus: OrderItemDeliveryStatus;

  @Exclude()
  orderId: string;

  @Exclude()
  supplyId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default OrderItemEntity;
