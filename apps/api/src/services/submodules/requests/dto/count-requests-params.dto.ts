import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountServicesRequestsParamsDtoSchema
  implements
    CountParams<
      Prisma.ServiceRequestWhereInput,
      Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.ServiceRequestWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>;
}

export class CountServicesRequestsParamsDto extends PartialType(
  CountServicesRequestsParamsDtoSchema
) {}

export default CountServicesRequestsParamsDto;
