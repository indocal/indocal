import { Entity } from '../../../../../common';

export interface Supplier extends Entity {
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export default Supplier;
