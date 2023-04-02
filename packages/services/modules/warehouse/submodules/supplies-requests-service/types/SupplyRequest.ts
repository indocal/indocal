import { Entity } from '../../../../../common';

import { UserStatus } from '../../../../auth/submodules/users-service';

import { SupplyRequestItemDeliveryStatus } from '../../supplies-requests-items-service';
import { SupplyUnit } from '../../supplies-service';

type RequestedBy = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type SupplyRequestItem = Entity & {
  quantity: number;
  received: number[];
  deliveryStatus: SupplyRequestItemDeliveryStatus;
  supply: Supply;
};

export type SupplyRequestStatus =
  | 'PENDING'
  | 'PARTIAL'
  | 'COMPLETED'
  | 'CANCELLED';

export interface SupplyRequest extends Entity {
  description: string;
  status: SupplyRequestStatus;
  items: SupplyRequestItem[];
  requestedBy: RequestedBy;
  deliveryAt: string[];
}

export default SupplyRequest;
