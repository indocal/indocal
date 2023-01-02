import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountWarehouseSuppliersParamsDto = CountParams<
  Prisma.SupplierWhereInput,
  Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>
>;

export default CountWarehouseSuppliersParamsDto;
