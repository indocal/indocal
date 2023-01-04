import { Exclude } from 'class-transformer';
import {
  Order as DBOrderModel,
  OrderStatus as DBOrderStatusEnum,
  OrderItem as DBOrderItemModel,
  Supplier as DBSupplierModel,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

import { OrderItemEntity } from '../../orders-items';
import { SupplierEntity } from '../../suppliers';

type Include = Partial<{
  items: DBOrderItemModel[];
  supplier: DBSupplierModel | null;
}>;

export class OrderEntity implements Entity, DBOrderModel {
  items?: OrderItemEntity[];
  supplier?: SupplierEntity;

  constructor(order: DBOrderModel, include?: Include) {
    Object.assign(this, order);

    if (include?.items) {
      this.items = include.items.map((item) => new OrderItemEntity(item));
    }

    if (include?.supplier) {
      this.supplier = new SupplierEntity(include.supplier);
    }
  }

  id: UUID;
  code: string;
  status: DBOrderStatusEnum;

  @Exclude()
  supplierId: string;

  deliveryAt: Date[];
  createdAt: Date;
  updatedAt: Date;
}

export default OrderEntity;
