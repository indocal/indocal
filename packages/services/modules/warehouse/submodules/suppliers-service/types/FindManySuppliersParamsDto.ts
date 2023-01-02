import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManySuppliersParamsDto = FindManyParams<
  Prisma.SupplierWhereInput,
  Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>,
  Prisma.Enumerable<Prisma.SupplierOrderByWithRelationInput>,
  Prisma.SupplierWhereUniqueInput
>;

export default FindManySuppliersParamsDto;
