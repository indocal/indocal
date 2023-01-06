import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyOrdersParamsDto = FindManyParams<
  Prisma.OrderWhereInput,
  Prisma.Enumerable<Prisma.OrderScalarFieldEnum>,
  Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>,
  Prisma.OrderWhereUniqueInput
>;

export default FindManyOrdersParamsDto;
