import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyApiTokensParamsDto = FindManyParams<
  Prisma.ApiTokenWhereInput,
  Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>,
  Prisma.Enumerable<Prisma.ApiTokenOrderByWithRelationInput>,
  Prisma.ApiTokenWhereUniqueInput
>;

export default FindManyApiTokensParamsDto;
