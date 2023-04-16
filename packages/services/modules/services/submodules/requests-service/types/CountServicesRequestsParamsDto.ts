import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountServicesRequestsParamsDto = CountParams<
  Prisma.ServiceRequestWhereInput,
  Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>
>;

export default CountServicesRequestsParamsDto;
