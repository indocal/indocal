import { Entity } from '../../../../../common';

import { OrderItemDeliveryStatus } from '../../orders-items-service';
import { SupplyUnit } from '../../supplies-service';

type RequestedBy = Entity & {
  name: string;
  description: string | null;
};

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type OrderItem = Entity & {
  price: number;
  quantity: number;
  received: number[];
  deliveryStatus: OrderItemDeliveryStatus;
  supply: Supply;
};

type Supplier = Entity & {
  name: string;
  description: string | null;
};

export type OrderStatus = 'PENDING' | 'PARTIAL' | 'COMPLETED' | 'CANCELLED';

export interface Order extends Entity {
  code: string;
  concept: string;
  status: OrderStatus;
  requestedBy: RequestedBy;
  deliveryAt: string[];
  items: OrderItem[];
  supplier: Supplier;
}

export default Order;
