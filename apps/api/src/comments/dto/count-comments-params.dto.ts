import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountCommentsParamsDtoSchema
  implements
    CountParams<
      Prisma.CommentWhereInput,
      Prisma.Enumerable<Prisma.CommentScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.CommentWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.CommentScalarFieldEnum>;
}

export class CountCommentsParamsDto extends PartialType(
  CountCommentsParamsDtoSchema
) {}

export default CountCommentsParamsDto;
