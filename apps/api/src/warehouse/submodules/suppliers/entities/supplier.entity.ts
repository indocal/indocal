import { Supplier } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplierEntity implements Entity, Supplier {
  constructor(supplier: Supplier) {
    Object.assign(this, supplier);
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default SupplierEntity;
