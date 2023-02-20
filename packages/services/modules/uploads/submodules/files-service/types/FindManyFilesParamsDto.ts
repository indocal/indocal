import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyFilesParamsDto = FindManyParams<
  Prisma.FileWhereInput,
  Prisma.Enumerable<Prisma.FileScalarFieldEnum>,
  Prisma.Enumerable<Prisma.FileOrderByWithRelationInput>,
  Prisma.FileWhereUniqueInput
>;

export default FindManyFilesParamsDto;
