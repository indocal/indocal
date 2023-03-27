import { Entity } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';

type Supply = Entity & {
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
};

export type SupplyPrice = {
  price: number;
  timestamp: string;
};

export interface SupplyPrices {
  supply: Supply;
  priceHistory: SupplyPrice[];
}

export default SupplyPrices;
