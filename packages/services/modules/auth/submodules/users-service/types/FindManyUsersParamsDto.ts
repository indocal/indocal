import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyUsersParamsDto = FindManyParams<
  Prisma.UserWhereInput,
  Prisma.Enumerable<Prisma.UserScalarFieldEnum>,
  Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>,
  Prisma.UserWhereUniqueInput
>;

export default FindManyUsersParamsDto;
