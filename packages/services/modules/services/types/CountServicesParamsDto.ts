import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountServicesParamsDto = CountParams<
  Prisma.ServiceWhereInput,
  Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>
>;

export default CountServicesParamsDto;
