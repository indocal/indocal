import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountServicesParamsDtoSchema
  implements
    CountParams<
      Prisma.ServiceWhereInput,
      Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.ServiceWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>;
}

export class CountServicesParamsDto extends PartialType(
  CountServicesParamsDtoSchema
) {}

export default CountServicesParamsDto;
