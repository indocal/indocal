import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyFormsEntriesParamsDto = FindManyParams<
  Prisma.FormEntryWhereInput,
  Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>,
  Prisma.Enumerable<Prisma.FormEntryOrderByWithRelationInput>,
  Prisma.FormEntryWhereUniqueInput
>;

export default FindManyFormsEntriesParamsDto;
