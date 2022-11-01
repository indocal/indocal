import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyEventsParamsDtoSchema
  implements
    FindManyParams<
      Prisma.EventWhereInput,
      Prisma.Enumerable<Prisma.EventScalarFieldEnum>,
      Prisma.Enumerable<Prisma.EventOrderByWithRelationInput>,
      Prisma.EventWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.EventWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.EventScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.EventOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.EventWhereUniqueInput>;
}

export class FindManyEventsParamsDto extends PartialType(
  FindManyEventsParamsDtoSchema
) {}

export default FindManyEventsParamsDto;
