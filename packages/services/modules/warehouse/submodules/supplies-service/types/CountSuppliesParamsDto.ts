import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountSuppliesParamsDto = CountParams<
  Prisma.SupplyWhereInput,
  Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>
>;

export default CountSuppliesParamsDto;
