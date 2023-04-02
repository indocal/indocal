import { Entity } from '../../../../../common';

import { OrderStatus } from '../../orders-service';
import { SupplyUnit } from '../../supplies-service';

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type Order = Entity & {
  code: string;
  concept: string;
  status: OrderStatus;
  deliveryAt: string[];
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
