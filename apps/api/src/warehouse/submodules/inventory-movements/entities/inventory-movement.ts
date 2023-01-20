import { Exclude } from 'class-transformer';
import { InventoryMovement, InventoryMovementType } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class InventoryMovementEntity implements Entity, InventoryMovement {
  constructor(movement: InventoryMovement) {
    Object.assign(this, movement);
  }

  id: UUID;
  concept: string | null;
  type: InventoryMovementType;

  @Exclude()
  orderId: string | null;

  @Exclude()
  originId: string | null;

  @Exclude()
  destinationId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default InventoryMovementEntity;
