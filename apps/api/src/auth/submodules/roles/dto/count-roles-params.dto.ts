import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountUsersRolesParamsDtoSchema
  implements
    CountParams<
      Prisma.UserRoleWhereInput,
      Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.UserRoleWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserRoleScalarFieldEnum>;
}

export class CountUsersRolesParamsDto extends PartialType(
  CountUsersRolesParamsDtoSchema
) {}

export default CountUsersRolesParamsDto;
