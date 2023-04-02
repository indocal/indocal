import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManySuppliesRequestsParamsDto = FindManyParams<
  Prisma.SupplyRequestWhereInput,
  Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>,
  Prisma.Enumerable<Prisma.SupplyRequestOrderByWithRelationInput>,
  Prisma.SupplyRequestWhereUniqueInput
>;

export default FindManySuppliesRequestsParamsDto;
