import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../common';

export type FindManyServicesParamsDto = FindManyParams<
  Prisma.ServiceWhereInput,
  Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>,
  Prisma.Enumerable<Prisma.ServiceOrderByWithRelationInput>,
  Prisma.ServiceWhereUniqueInput
>;

export default FindManyServicesParamsDto;
