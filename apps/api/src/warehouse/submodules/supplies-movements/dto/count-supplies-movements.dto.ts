import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountSuppliesMovementsParamsDtoSchema
  implements
    CountParams<
      Prisma.SupplyMovementWhereInput,
      Prisma.Enumerable<Prisma.SupplyMovementScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.SupplyMovementWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyMovementScalarFieldEnum>;
}

export class CountSuppliesMovementsParamsDto extends PartialType(
  CountSuppliesMovementsParamsDtoSchema
) {}

export default CountSuppliesMovementsParamsDto;
