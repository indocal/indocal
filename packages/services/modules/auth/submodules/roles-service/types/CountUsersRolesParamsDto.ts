import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountUsersRolesParamsDto = CountParams<
  Prisma.UserRoleWhereInput,
  Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>
>;

export default CountUsersRolesParamsDto;
