import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyInventoryMovementsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.InventoryMovementWhereInput,
      Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>,
      Prisma.Enumerable<Prisma.InventoryMovementOrderByWithRelationInput>,
      Prisma.InventoryMovementWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.InventoryMovementWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.InventoryMovementOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.InventoryMovementWhereUniqueInput>;
}

export class FindManyInventoryMovementsParamsDto extends PartialType(
  FindManyInventoryMovementsParamsDtoSchema
) {}

export default FindManyInventoryMovementsParamsDto;
