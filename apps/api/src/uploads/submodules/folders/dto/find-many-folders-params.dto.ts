import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyFoldersParamsDtoSchema
  implements
    FindManyParams<
      Prisma.FolderWhereInput,
      Prisma.Enumerable<Prisma.FolderScalarFieldEnum>,
      Prisma.Enumerable<Prisma.FolderOrderByWithRelationInput>,
      Prisma.FolderWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.FolderWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FolderScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.FolderOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.FolderWhereUniqueInput>;
}

export class FindManyFoldersParamsDto extends PartialType(
  FindManyFoldersParamsDtoSchema
) {}

export default FindManyFoldersParamsDto;
