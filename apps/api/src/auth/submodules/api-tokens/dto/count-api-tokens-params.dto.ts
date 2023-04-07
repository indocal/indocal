import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountApiTokensParamsDtoSchema
  implements
    CountParams<
      Prisma.ApiTokenWhereInput,
      Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.ApiTokenWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>;
}

export class CountApiTokensParamsDto extends PartialType(
  CountApiTokensParamsDtoSchema
) {}

export default CountApiTokensParamsDto;
