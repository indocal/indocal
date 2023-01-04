import { Exclude } from 'class-transformer';
import {
  OrderItem as DBOrderItemModel,
  OrderItemDeliveryStatus as DBOrderItemDeliveryStatusEnum,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

export class OrderItemEntity implements Entity, DBOrderItemModel {
  constructor(item: DBOrderItemModel) {
    Object.assign(this, item);
  }

  id: UUID;
  price: number;
  quantity: number;
  received: number[];
  deliveryStatus: DBOrderItemDeliveryStatusEnum;

  @Exclude()
  orderId: string;

  @Exclude()
  supplyId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default OrderItemEntity;
