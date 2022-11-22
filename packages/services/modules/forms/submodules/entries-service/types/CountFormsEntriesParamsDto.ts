import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountFormsEntriesParamsDto = CountParams<
  Prisma.FormEntryWhereInput,
  Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>
>;

export default CountFormsEntriesParamsDto;
