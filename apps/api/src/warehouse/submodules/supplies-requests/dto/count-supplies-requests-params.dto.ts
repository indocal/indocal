import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountSuppliesRequestsParamsDtoSchema
  implements
    CountParams<
      Prisma.SupplyRequestWhereInput,
      Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.SupplyRequestWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>;
}

export class CountSuppliesRequestsParamsDto extends PartialType(
  CountSuppliesRequestsParamsDtoSchema
) {}

export default CountSuppliesRequestsParamsDto;
