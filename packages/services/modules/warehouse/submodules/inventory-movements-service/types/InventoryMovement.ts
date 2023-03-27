import { Entity } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';
import { OrderStatus } from '../../orders-service';

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type InventoryMovementItem = Entity & {
  quantity: number;
  supply: Supply;
};

type Supplier = Entity & {
  name: string;
  description: string | null;
};

type RequestedBy = Entity & {
  name: string;
  description: string | null;
};

type Order = Entity & {
  code: string;
  concept: string;
  status: OrderStatus;
  supplier: Supplier;
  requestedBy: RequestedBy;
  deliveryAt: string[];
};

type Origin = Entity & {
  name: string;
  description: string | null;
};

type Destination = Entity & {
  name: string;
  description: string | null;
};

export type InventoryMovementType =
  | 'ADJUSTMENT'
  | 'INPUT'
  | 'OUTPUT'
  | 'TRANSFER'
  | 'DISCHARGE';

export interface InventoryMovement extends Entity {
  concept: string | null;
  type: InventoryMovementType;
  items: InventoryMovementItem[];
  order: Order | null;
  origin: Origin | null;
  destination: Destination | null;
}

export default InventoryMovement;
