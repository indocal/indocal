import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountUsersParamsDto = CountParams<
  Prisma.UserWhereInput,
  Prisma.Enumerable<Prisma.UserScalarFieldEnum>
>;

export default CountUsersParamsDto;
