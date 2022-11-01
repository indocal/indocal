import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyUsersRolesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.UserRoleWhereInput,
      Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>,
      Prisma.Enumerable<Prisma.UserRoleOrderByWithRelationInput>,
      Prisma.UserRoleWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.UserRoleWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.UserRoleOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.UserRoleWhereUniqueInput>;
}

export class FindManyUsersRolesParamsDto extends PartialType(
  FindManyUsersRolesParamsDtoSchema
) {}

export default FindManyUsersRolesParamsDto;
