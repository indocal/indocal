import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyServicesRequestsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.ServiceRequestWhereInput,
      Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>,
      Prisma.Enumerable<Prisma.ServiceRequestOrderByWithRelationInput>,
      Prisma.ServiceRequestWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.ServiceRequestWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceRequestScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.ServiceRequestOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.ServiceRequestWhereUniqueInput>;
}

export class FindManyServicesRequestsParamsDto extends PartialType(
  FindManyServicesRequestsParamsDtoSchema
) {}

export default FindManyServicesRequestsParamsDto;
