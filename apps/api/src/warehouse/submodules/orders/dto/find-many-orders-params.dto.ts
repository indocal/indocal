import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyOrdersParamsDtoSchema
  implements
    FindManyParams<
      Prisma.OrderWhereInput,
      Prisma.Enumerable<Prisma.OrderScalarFieldEnum>,
      Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>,
      Prisma.OrderWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.OrderWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.OrderScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.OrderWhereUniqueInput>;
}

export class FindManyOrdersParamsDto extends PartialType(
  FindManyOrdersParamsDtoSchema
) {}

export default FindManyOrdersParamsDto;
