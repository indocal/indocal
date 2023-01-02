import { Supplier as DBSupplierModel } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class SupplierEntity implements Entity, DBSupplierModel {
  constructor(supplier: DBSupplierModel) {
    Object.assign(this, supplier);
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default SupplierEntity;
