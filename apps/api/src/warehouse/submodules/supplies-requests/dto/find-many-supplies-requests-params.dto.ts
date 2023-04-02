import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManySuppliesRequestsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.SupplyRequestWhereInput,
      Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>,
      Prisma.Enumerable<Prisma.SupplyRequestOrderByWithRelationInput>,
      Prisma.SupplyRequestWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.SupplyRequestWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplyRequestScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.SupplyRequestOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.SupplyRequestWhereUniqueInput>;
}

export class FindManySuppliesRequestsParamsDto extends PartialType(
  FindManySuppliesRequestsParamsDtoSchema
) {}

export default FindManySuppliesRequestsParamsDto;
