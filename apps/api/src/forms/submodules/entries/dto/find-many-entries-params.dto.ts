import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyFormsEntriesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.FormEntryWhereInput,
      Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>,
      Prisma.Enumerable<Prisma.FormEntryOrderByWithRelationInput>,
      Prisma.FormEntryWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.FormEntryWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.FormEntryOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.FormEntryWhereUniqueInput>;
}

export class FindManyFormsEntriesParamsDto extends PartialType(
  FindManyFormsEntriesParamsDtoSchema
) {}

export default FindManyFormsEntriesParamsDto;
