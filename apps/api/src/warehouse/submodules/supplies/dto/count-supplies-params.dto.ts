import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountSuppliesParamsDtoSchema
  implements
    CountParams<
      Prisma.SupplyWhereInput,
      Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.SupplyWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>;
}

export class CountSuppliesParamsDto extends PartialType(
  CountSuppliesParamsDtoSchema
) {}

export default CountSuppliesParamsDto;
