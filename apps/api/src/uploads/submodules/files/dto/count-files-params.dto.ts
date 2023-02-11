import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountFilesParamsDtoSchema
  implements
    CountParams<
      Prisma.FileWhereInput,
      Prisma.Enumerable<Prisma.FileScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.FileWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FileScalarFieldEnum>;
}

export class CountFilesParamsDto extends PartialType(
  CountFilesParamsDtoSchema
) {}

export default CountFilesParamsDto;
