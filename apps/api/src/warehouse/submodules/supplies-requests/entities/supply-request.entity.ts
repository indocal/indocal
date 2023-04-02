import { Exclude } from 'class-transformer';
import { SupplyRequest, SupplyRequestStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplyRequestEntity implements Entity, SupplyRequest {
  constructor(SupplyRequest: SupplyRequest) {
    Object.assign(this, SupplyRequest);
  }

  id: UUID;
  description: string;
  status: SupplyRequestStatus;

  @Exclude()
  requestedById: UUID;

  deliveryAt: Date[];
  createdAt: Date;
  updatedAt: Date;
}

export default SupplyRequestEntity;
