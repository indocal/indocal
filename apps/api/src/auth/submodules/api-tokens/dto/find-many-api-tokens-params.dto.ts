import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyApiTokensParamsDtoSchema
  implements
    FindManyParams<
      Prisma.ApiTokenWhereInput,
      Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>,
      Prisma.Enumerable<Prisma.ApiTokenOrderByWithRelationInput>,
      Prisma.ApiTokenWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.ApiTokenWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ApiTokenScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.ApiTokenOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.ApiTokenWhereUniqueInput>;
}

export class FindManyApiTokensParamsDto extends PartialType(
  FindManyApiTokensParamsDtoSchema
) {}

export default FindManyApiTokensParamsDto;
