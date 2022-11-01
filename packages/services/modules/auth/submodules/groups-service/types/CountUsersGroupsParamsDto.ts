import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountUsersGroupsParamsDto = CountParams<
  Prisma.UserGroupWhereInput,
  Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>
>;

export default CountUsersGroupsParamsDto;
