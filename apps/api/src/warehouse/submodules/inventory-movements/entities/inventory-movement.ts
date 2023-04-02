import { Exclude } from 'class-transformer';
import { InventoryMovement, InventoryMovementType } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class InventoryMovementEntity implements Entity, InventoryMovement {
  constructor(movement: InventoryMovement) {
    Object.assign(this, movement);
  }

  id: UUID;
  concept: string;
  type: InventoryMovementType;

  @Exclude()
  orderId: UUID | null;

  @Exclude()
  originId: UUID | null;

  @Exclude()
  destinationId: UUID | null;

  @Exclude()
  requestId: UUID | null;

  createdAt: Date;
  updatedAt: Date;
}

export default InventoryMovementEntity;
