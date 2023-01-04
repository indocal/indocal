import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountOrdersParamsDtoSchema
  implements
    CountParams<
      Prisma.OrderWhereInput,
      Prisma.Enumerable<Prisma.OrderScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.OrderWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.OrderScalarFieldEnum>;
}

export class CountOrdersParamsDto extends PartialType(
  CountOrdersParamsDtoSchema
) {}

export default CountOrdersParamsDto;
