import { Entity } from '../../../../../common';

import { SupplyRequestStatus } from '../../supplies-requests-service';
import { SupplyUnit } from '../../supplies-service';

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

type SupplyRequest = Entity & {
  description: string;
  status: SupplyRequestStatus;
  deliveryAt: string[];
};

export type SupplyRequestItemDeliveryStatus =
  | 'PENDING'
  | 'PARTIAL'
  | 'COMPLETED';

export interface SupplyRequestItem extends Entity {
  quantity: number;
  received: number[];
  deliveryStatus: SupplyRequestItemDeliveryStatus;
  supply: Supply;
  order: SupplyRequest;
}

export default SupplyRequestItem;
