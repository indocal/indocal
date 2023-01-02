import { Entity } from '../../../../../common';

export interface WarehouseSupplier extends Entity {
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default WarehouseSupplier;
