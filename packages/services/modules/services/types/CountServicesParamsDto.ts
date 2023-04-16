import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountServicesParamsDto = CountParams<
  Prisma.FormWhereInput,
  Prisma.Enumerable<Prisma.FormScalarFieldEnum>
>;

export default CountServicesParamsDto;
