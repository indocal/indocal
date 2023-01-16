import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManySuppliesMovementsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.SupplyMovementWhereInput,
      Prisma.Enumerable<Prisma.SupplyMovementScalarFieldEnum>,
      Prisma.Enumerable<Prisma.SupplyMovementOrderByWithRelationInput>,
      Prisma.SupplyMovementWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.SupplyMovementWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyMovementScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.SupplyMovementOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.SupplyMovementWhereUniqueInput>;
}

export class FindManySuppliesMovementsParamsDto extends PartialType(
  FindManySuppliesMovementsParamsDtoSchema
) {}

export default FindManySuppliesMovementsParamsDto;
