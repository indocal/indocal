import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountOrdersParamsDto = CountParams<
  Prisma.OrderWhereInput,
  Prisma.Enumerable<Prisma.OrderScalarFieldEnum>
>;

export default CountOrdersParamsDto;
