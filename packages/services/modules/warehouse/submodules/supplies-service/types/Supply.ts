import { Entity } from '../../../../../common';

export type SupplyUnit =
  | 'UNIT'
  | 'PACK'
  | 'BOX'
  | 'BLOCK'
  | 'REAM'
  | 'BALE'
  | 'SACK'
  | 'GALLON';

export interface Supply extends Entity {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
  createdAt: string;
  updatedAt: string;
}

export default Supply;
