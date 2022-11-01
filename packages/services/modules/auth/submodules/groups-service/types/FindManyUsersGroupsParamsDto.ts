import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyUsersGroupsParamsDto = FindManyParams<
  Prisma.UserGroupWhereInput,
  Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>,
  Prisma.Enumerable<Prisma.UserGroupOrderByWithRelationInput>,
  Prisma.UserGroupWhereUniqueInput
>;

export default FindManyUsersGroupsParamsDto;
