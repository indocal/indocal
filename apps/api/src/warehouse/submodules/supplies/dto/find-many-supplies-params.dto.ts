import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManySuppliesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.SupplyWhereInput,
      Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>,
      Prisma.Enumerable<Prisma.SupplyOrderByWithRelationInput>,
      Prisma.SupplyWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.SupplyWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.SupplyOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.SupplyWhereUniqueInput>;
}

export class FindManySuppliesParamsDto extends PartialType(
  FindManySuppliesParamsDtoSchema
) {}

export default FindManySuppliesParamsDto;
