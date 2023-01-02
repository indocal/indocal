import {
  Supply as DBSupplyModel,
  SupplyUnit as DBSupplyUnitEnum,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplyEntity implements Entity, DBSupplyModel {
  constructor(supply: DBSupplyModel) {
    Object.assign(this, supply);
  }

  id: UUID;
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: DBSupplyUnitEnum;
  createdAt: Date;
  updatedAt: Date;
}

export default SupplyEntity;
