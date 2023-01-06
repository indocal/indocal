import { Supply, SupplyUnit } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplyEntity implements Entity, Supply {
  constructor(supply: Supply) {
    Object.assign(this, supply);
  }

  id: UUID;
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
  createdAt: Date;
  updatedAt: Date;
}

export default SupplyEntity;
