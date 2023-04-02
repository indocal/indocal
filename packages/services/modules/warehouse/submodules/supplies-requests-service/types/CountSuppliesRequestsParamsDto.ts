import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountSuppliesRequestsParamsDto = CountParams<
  Prisma.SupplyRequestWhereInput,
  Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>
>;

export default CountSuppliesRequestsParamsDto;
