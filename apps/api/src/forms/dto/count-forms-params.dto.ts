import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountFormsParamsDtoSchema
  implements
    CountParams<
      Prisma.FormWhereInput,
      Prisma.Enumerable<Prisma.FormScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.FormWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.FormScalarFieldEnum>;
}

export class CountFormsParamsDto extends PartialType(
  CountFormsParamsDtoSchema
) {}

export default CountFormsParamsDto;
