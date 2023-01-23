import { UUID } from '../../../../../common';

import { SupplyUnit } from '../../supplies-service';

type Supply = {
  id: UUID;
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
  createdAt: string;
  updatedAt: string;
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
