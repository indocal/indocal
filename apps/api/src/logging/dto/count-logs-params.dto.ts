import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountLogsParamsDtoSchema
  implements
    CountParams<
      Prisma.LogWhereInput,
      Prisma.Enumerable<Prisma.LogScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.LogWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.LogScalarFieldEnum>;
}

export class CountLogsParamsDto extends PartialType(CountLogsParamsDtoSchema) {}

export default CountLogsParamsDto;
