import { Exclude } from 'class-transformer';
import { Order, OrderStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class OrderEntity implements Entity, Order {
  constructor(order: Order) {
    Object.assign(this, order);
  }

  id: UUID;
  code: string;
  concept: string;
  status: OrderStatus;

  @Exclude()
  supplierId: UUID;

  @Exclude()
  requestedById: UUID;

  deliveryAt: Date[];
  createdAt: Date;
  updatedAt: Date;
}

export default OrderEntity;
