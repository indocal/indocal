import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountApiTokensParamsDto = CountParams<
  Prisma.ApiTokenWhereInput,
  Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>
>;

export default CountApiTokensParamsDto;
