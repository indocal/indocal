import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManySuppliesParamsDto = FindManyParams<
  Prisma.SupplyWhereInput,
  Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>,
  Prisma.Enumerable<Prisma.SupplyOrderByWithRelationInput>,
  Prisma.SupplyWhereUniqueInput
>;

export default FindManySuppliesParamsDto;
