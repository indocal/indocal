import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../common';

export type FindManyFormsParamsDto = FindManyParams<
  Prisma.FormWhereInput,
  Prisma.Enumerable<Prisma.FormScalarFieldEnum>,
  Prisma.Enumerable<Prisma.FormOrderByWithRelationInput>,
  Prisma.FormWhereUniqueInput
>;

export default FindManyFormsParamsDto;
