import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountInventoryMovementsParamsDtoSchema
  implements
    CountParams<
      Prisma.InventoryMovementWhereInput,
      Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.InventoryMovementWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>;
}

export class CountInventoryMovementsParamsDto extends PartialType(
  CountInventoryMovementsParamsDtoSchema
) {}

export default CountInventoryMovementsParamsDto;
