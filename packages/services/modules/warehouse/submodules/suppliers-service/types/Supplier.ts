import { Entity } from '../../../../../common';

export interface Supplier extends Entity {
  name: string;
  description: string | null;
}

export default Supplier;
