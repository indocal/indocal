import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManySuppliersParamsDtoSchema
  implements
    FindManyParams<
      Prisma.SupplierWhereInput,
      Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>,
      Prisma.Enumerable<Prisma.SupplierOrderByWithRelationInput>,
      Prisma.SupplierWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.SupplierWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.SupplierOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.SupplierWhereUniqueInput>;
}

export class FindManySuppliersParamsDto extends PartialType(
  FindManySuppliersParamsDtoSchema
) {}

export default FindManySuppliersParamsDto;
