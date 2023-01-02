import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountWarehouseSuppliersParamsDtoSchema
  implements
    CountParams<
      Prisma.SupplierWhereInput,
      Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.SupplierWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.SupplierScalarFieldEnum>;
}

export class CountWarehouseSuppliersParamsDto extends PartialType(
  CountWarehouseSuppliersParamsDtoSchema
) {}

export default CountWarehouseSuppliersParamsDto;
