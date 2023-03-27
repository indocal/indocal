import { Entity } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';
import { OrderStatus } from '../../orders-service';
import { InventoryMovementType } from '../../inventory-movements-service';

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type Supplier = Entity & {
  name: string;
  description: string | null;
};

type Order = Entity & {
  code: string;
  status: OrderStatus;
  supplier: Supplier;
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

type Movement = Entity & {
  concept: string | null;
  type: InventoryMovementType;
  order: Order | null;
  origin: Origin | null;
  destination: Destination | null;
};

export interface InventoryMovementItem extends Entity {
  quantity: number;
  supply: Supply;
  movement: Movement;
}

export default InventoryMovementItem;
