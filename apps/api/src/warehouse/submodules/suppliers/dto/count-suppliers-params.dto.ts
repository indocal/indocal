import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountSuppliersParamsDtoSchema
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

export class CountSuppliersParamsDto extends PartialType(
  CountSuppliersParamsDtoSchema
) {}

export default CountSuppliersParamsDto;
