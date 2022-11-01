import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyUsersRolesParamsDto = FindManyParams<
  Prisma.UserRoleWhereInput,
  Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>,
  Prisma.Enumerable<Prisma.UserRoleOrderByWithRelationInput>,
  Prisma.UserRoleWhereUniqueInput
>;

export default FindManyUsersRolesParamsDto;
