import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountFilesParamsDto = CountParams<
  Prisma.FileWhereInput,
  Prisma.Enumerable<Prisma.FileScalarFieldEnum>
>;

export default CountFilesParamsDto;
