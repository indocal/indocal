import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyCommentsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.CommentWhereInput,
      Prisma.Enumerable<Prisma.CommentScalarFieldEnum>,
      Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput>,
      Prisma.CommentWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.CommentWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.CommentScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.CommentOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.CommentWhereUniqueInput>;
}

export class FindManyCommentsParamsDto extends PartialType(
  FindManyCommentsParamsDtoSchema
) {}

export default FindManyCommentsParamsDto;
