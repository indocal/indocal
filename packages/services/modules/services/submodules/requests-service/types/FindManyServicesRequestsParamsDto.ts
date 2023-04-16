import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyServicesRequestsParamsDto = FindManyParams<
  Prisma.ServiceRequestWhereInput,
  Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>,
  Prisma.Enumerable<Prisma.ServiceRequestOrderByWithRelationInput>,
  Prisma.ServiceRequestWhereUniqueInput
>;

export default FindManyServicesRequestsParamsDto;
