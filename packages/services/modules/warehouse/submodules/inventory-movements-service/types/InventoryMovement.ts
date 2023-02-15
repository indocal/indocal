import { Entity, UUID } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';
import { OrderStatus } from '../../orders-service';

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

type InventoryMovementItem = {
  id: UUID;
  quantity: number;
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

type Order = {
  id: UUID;
  code: string;
  status: OrderStatus;
  supplier: Supplier;
  deliveryAt: string[];
  createdAt: string;
  updatedAt: string;
};

type Origin = {
  id: UUID;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type Destination = {
  id: UUID;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
