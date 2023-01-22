import { Entity, UUID } from '../../../../../common';

import { OrderStatus } from '../../orders-service';
import { SupplyUnit } from '../../supplies-service';

type Supply = {
  id: UUID;
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  id: UUID;
  code: string;
  status: OrderStatus;
  deliveryAt: string[];
  createdAt: string;
  updatedAt: string;
};

export type OrderItemDeliveryStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED';

export interface OrderItem extends Entity {
  price: number;
  quantity: number;
  received: number[];
  deliveryStatus: OrderItemDeliveryStatus;
  supply: Supply;
  order: Order;
}

export default OrderItem;
