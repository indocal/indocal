import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountFormsParamsDto = CountParams<
  Prisma.FormWhereInput,
  Prisma.Enumerable<Prisma.FormScalarFieldEnum>
>;

export default CountFormsParamsDto;
