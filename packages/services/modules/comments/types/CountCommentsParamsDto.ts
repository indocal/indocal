import { Prisma } from '@prisma/client';

import { CountParams } from '../../../common';

export type CountCommentsParamsDto = CountParams<
  Prisma.CommentWhereInput,
  Prisma.Enumerable<Prisma.CommentScalarFieldEnum>
>;

export default CountCommentsParamsDto;
