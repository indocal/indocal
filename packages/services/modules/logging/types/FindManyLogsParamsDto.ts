import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../common';

export type FindManyLogsParamsDto = FindManyParams<
  Prisma.LogWhereInput,
  Prisma.Enumerable<Prisma.LogScalarFieldEnum>,
  Prisma.Enumerable<Prisma.LogOrderByWithRelationInput>,
  Prisma.LogWhereUniqueInput
>;

export default FindManyLogsParamsDto;
