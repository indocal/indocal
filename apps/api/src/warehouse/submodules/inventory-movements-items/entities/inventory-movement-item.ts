import { Exclude } from 'class-transformer';
import { InventoryMovementItem } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class InventoryMovementItemEntity
  implements Entity, InventoryMovementItem
{
  constructor(item: InventoryMovementItem) {
    Object.assign(this, item);
  }

  id: UUID;
  quantity: number;

  @Exclude()
  supplyId: UUID;

  @Exclude()
  movementId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default InventoryMovementItemEntity;
