import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyFormsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.FormWhereInput,
      Prisma.Enumerable<Prisma.FormScalarFieldEnum>,
      Prisma.Enumerable<Prisma.FormOrderByWithRelationInput>,
      Prisma.FormWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.FormWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FormScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.FormOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.FormWhereUniqueInput>;
}

export class FindManyFormsParamsDto extends PartialType(
  FindManyFormsParamsDtoSchema
) {}

export default FindManyFormsParamsDto;
