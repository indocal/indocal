import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountEventsParamsDto = CountParams<
  Prisma.EventWhereInput,
  Prisma.Enumerable<Prisma.EventScalarFieldEnum>
>;

export default CountEventsParamsDto;
