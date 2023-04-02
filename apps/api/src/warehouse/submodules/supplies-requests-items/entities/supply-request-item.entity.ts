import { Exclude } from 'class-transformer';
import {
  SupplyRequestItem,
  SupplyRequestItemDeliveryStatus,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplyRequestItemEntity implements Entity, SupplyRequestItem {
  constructor(item: SupplyRequestItem) {
    Object.assign(this, item);
  }

  id: UUID;
  quantity: number;
  received: number[];
  deliveryStatus: SupplyRequestItemDeliveryStatus;

  @Exclude()
  supplyId: UUID;

  @Exclude()
  requestId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default SupplyRequestItemEntity;
