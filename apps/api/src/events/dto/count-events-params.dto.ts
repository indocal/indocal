import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountEventsParamsDtoSchema
  implements
    CountParams<
      Prisma.EventWhereInput,
      Prisma.Enumerable<Prisma.EventScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.EventWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.EventScalarFieldEnum>;
}

export class CountEventsParamsDto extends PartialType(
  CountEventsParamsDtoSchema
) {}

export default CountEventsParamsDto;
