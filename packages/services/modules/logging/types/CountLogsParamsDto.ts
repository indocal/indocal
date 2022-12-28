import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountLogsParamsDto = CountParams<
  Prisma.LogWhereInput,
  Prisma.Enumerable<Prisma.LogScalarFieldEnum>
>;

export default CountLogsParamsDto;
