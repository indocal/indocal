import { Entity, UUID } from '../../../../../common';

import { OrderItemDeliveryStatus } from '../../orders-items-service';
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

type OrderItem = {
  id: UUID;
  price: number;
  quantity: number;
  received: number[];
  deliveryStatus: OrderItemDeliveryStatus;
  supply: Supply;
  createdAt: string;
  updatedAt: string;
};

type Supplier = {
  id: UUID;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';

export interface Order extends Entity {
  code: string;
  status: OrderStatus;
  deliveryAt: string[];
  items: OrderItem[];
  supplier: Supplier;
}

export default Order;
