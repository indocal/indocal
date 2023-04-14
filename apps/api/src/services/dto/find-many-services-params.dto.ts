import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyServicesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.ServiceWhereInput,
      Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>,
      Prisma.Enumerable<Prisma.ServiceOrderByWithRelationInput>,
      Prisma.ServiceWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.ServiceWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.ServiceOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.ServiceWhereUniqueInput>;
}

export class FindManyServicesParamsDto extends PartialType(
  FindManyServicesParamsDtoSchema
) {}

export default FindManyServicesParamsDto;
