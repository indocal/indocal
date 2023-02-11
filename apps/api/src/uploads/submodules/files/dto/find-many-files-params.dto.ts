import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyFilesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.FileWhereInput,
      Prisma.Enumerable<Prisma.FileScalarFieldEnum>,
      Prisma.Enumerable<Prisma.FileOrderByWithRelationInput>,
      Prisma.FileWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.FileWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FileScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.FileOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.FileWhereUniqueInput>;
}

export class FindManyFilesParamsDto extends PartialType(
  FindManyFilesParamsDtoSchema
) {}

export default FindManyFilesParamsDto;
