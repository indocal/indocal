import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyUsersGroupsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.UserGroupWhereInput,
      Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>,
      Prisma.Enumerable<Prisma.UserGroupOrderByWithRelationInput>,
      Prisma.UserGroupWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.UserGroupWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.UserGroupOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.UserGroupWhereUniqueInput>;
}

export class FindManyUsersGroupsParamsDto extends PartialType(
  FindManyUsersGroupsParamsDtoSchema
) {}

export default FindManyUsersGroupsParamsDto;
