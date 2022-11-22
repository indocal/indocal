import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountFormsEntriesParamsDtoSchema
  implements
    CountParams<
      Prisma.FormEntryWhereInput,
      Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.FormEntryWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FormEntryScalarFieldEnum>;
}

export class CountFormsEntriesParamsDto extends PartialType(
  CountFormsEntriesParamsDtoSchema
) {}

export default CountFormsEntriesParamsDto;
