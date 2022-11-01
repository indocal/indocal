import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../common';

export type FindManyEventsParamsDto = FindManyParams<
  Prisma.EventWhereInput,
  Prisma.Enumerable<Prisma.EventScalarFieldEnum>,
  Prisma.Enumerable<Prisma.EventOrderByWithRelationInput>,
  Prisma.EventWhereUniqueInput
>;

export default FindManyEventsParamsDto;
