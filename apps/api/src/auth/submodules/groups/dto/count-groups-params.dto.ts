import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountUsersGroupsParamsDtoSchema
  implements
    CountParams<
      Prisma.UserGroupWhereInput,
      Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.UserGroupWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserGroupScalarFieldEnum>;
}

export class CountUsersGroupsParamsDto extends PartialType(
  CountUsersGroupsParamsDtoSchema
) {}

export default CountUsersGroupsParamsDto;
