import { Supplier as DBWarehouseSupplierModel } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class WarehouseSupplierEntity
  implements Entity, DBWarehouseSupplierModel
{
  constructor(supplier: DBWarehouseSupplierModel) {
    Object.assign(this, supplier);
  }

  id: UUID;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default WarehouseSupplierEntity;
