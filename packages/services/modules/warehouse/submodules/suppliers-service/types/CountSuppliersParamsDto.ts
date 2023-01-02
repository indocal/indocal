import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountSuppliersParamsDto = CountParams<
  Prisma.SupplierWhereInput,
  Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>
>;

export default CountSuppliersParamsDto;
