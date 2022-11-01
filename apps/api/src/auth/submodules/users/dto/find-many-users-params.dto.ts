import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyUsersParamsDtoSchema
  implements
    FindManyParams<
      Prisma.UserWhereInput,
      Prisma.Enumerable<Prisma.UserScalarFieldEnum>,
      Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>,
      Prisma.UserWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.UserWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.UserWhereUniqueInput>;
}

export class FindManyUsersParamsDto extends PartialType(
  FindManyUsersParamsDtoSchema
) {}

export default FindManyUsersParamsDto;
