import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountUsersParamsDtoSchema
  implements
    CountParams<
      Prisma.UserWhereInput,
      Prisma.Enumerable<Prisma.UserScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.UserWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.UserScalarFieldEnum>;
}

export class CountUsersParamsDto extends PartialType(
  CountUsersParamsDtoSchema
) {}

export default CountUsersParamsDto;
