import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyLogsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.LogWhereInput,
      Prisma.Enumerable<Prisma.LogScalarFieldEnum>,
      Prisma.Enumerable<Prisma.LogOrderByWithRelationInput>,
      Prisma.LogWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.LogWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.LogScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.LogOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.LogWhereUniqueInput>;
}

export class FindManyLogsParamsDto extends PartialType(
  FindManyLogsParamsDtoSchema
) {}

export default FindManyLogsParamsDto;
