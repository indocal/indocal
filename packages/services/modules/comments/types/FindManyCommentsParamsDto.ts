import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../common';

export type FindManyCommentsParamsDto = FindManyParams<
  Prisma.CommentWhereInput,
  Prisma.Enumerable<Prisma.CommentScalarFieldEnum>,
  Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput>,
  Prisma.CommentWhereUniqueInput
>;

export default FindManyCommentsParamsDto;
