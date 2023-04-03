import { Entity } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';
import { OrderStatus } from '../../orders-service';
import { SupplyRequestStatus } from '../../supplies-requests-service';
import { UserStatus } from '../../../../auth/submodules/users-service';
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

type UserGroup = Entity & {
  name: string;
  description: string | null;
};

type Order = Entity & {
  code: string;
  concept: string;
  status: OrderStatus;
  supplier: Supplier;
  requestedBy: UserGroup;
  deliveryAt: string[];
};

type User = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

type SupplyRequest = Entity & {
  description: string;
  status: SupplyRequestStatus;
  deliveryAt: string[];
  requestedBy: User;
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
  request: SupplyRequest | null;
  origin: Origin | null;
  destination: Destination | null;
};

export interface InventoryMovementItem extends Entity {
  quantity: number;
  supply: Supply;
  movement: Movement;
}

export default InventoryMovementItem;
