import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountFoldersParamsDto = CountParams<
  Prisma.FolderWhereInput,
  Prisma.Enumerable<Prisma.FolderScalarFieldEnum>
>;

export default CountFoldersParamsDto;
