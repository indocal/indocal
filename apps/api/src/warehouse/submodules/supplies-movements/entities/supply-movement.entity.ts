import { Exclude } from 'class-transformer';
import { SupplyMovement, SupplyMovementType } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplyMovementEntity implements Entity, SupplyMovement {
  constructor(movement: SupplyMovement) {
    Object.assign(this, movement);
  }

  id: UUID;
  quantity: number;
  type: SupplyMovementType;

  @Exclude()
  supplyId: string;

  @Exclude()
  originId: string | null;

  @Exclude()
  destinationId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default SupplyMovementEntity;
