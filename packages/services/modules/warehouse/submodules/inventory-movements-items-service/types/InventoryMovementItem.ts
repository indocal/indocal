import { Entity, UUID } from '../../../../../common';

import { UserStatus } from '../../../../auth';

import { SupplyUnit } from '../../supplies-service';
import { OrderStatus } from '../../orders-service';
import { InventoryMovementType } from '../../inventory-movements-service';

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
  deliveryAt: string[];
  createdAt: string;
  updatedAt: string;
};

type Origin = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  supplier: Supplier;
  createdAt: string;
  updatedAt: string;
};

type Destination = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

type Movement = {
  id: UUID;
  concept: string | null;
  type: InventoryMovementType;
  order: Order | null;
  origin: Origin | null;
  destination: Destination | null;
  createdAt: string;
  updatedAt: string;
};

export interface InventoryMovementItem extends Entity {
  quantity: number;
  supply: Supply;
  movement: Movement;
}

export default InventoryMovementItem;
