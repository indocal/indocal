import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyFoldersParamsDto = FindManyParams<
  Prisma.FolderWhereInput,
  Prisma.Enumerable<Prisma.FolderScalarFieldEnum>,
  Prisma.Enumerable<Prisma.FolderOrderByWithRelationInput>,
  Prisma.FolderWhereUniqueInput
>;

export default FindManyFoldersParamsDto;
