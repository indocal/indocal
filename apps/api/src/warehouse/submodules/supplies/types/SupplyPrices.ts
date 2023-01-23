import { Supply } from '@prisma/client';

export type SupplyPrice = {
  price: number;
  timestamp: string;
};

export interface SupplyPrices {
  supply: Supply;
  priceHistory: SupplyPrice[];
}

export default SupplyPrices;
