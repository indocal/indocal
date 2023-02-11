import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountFoldersParamsDtoSchema
  implements
    CountParams<
      Prisma.FolderWhereInput,
      Prisma.Enumerable<Prisma.FolderScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.FolderWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FolderScalarFieldEnum>;
}

export class CountFoldersParamsDto extends PartialType(
  CountFoldersParamsDtoSchema
) {}

export default CountFoldersParamsDto;
