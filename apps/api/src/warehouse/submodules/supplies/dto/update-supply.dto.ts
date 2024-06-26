import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { SupplyUnit } from '@prisma/client';

import { TrimParam } from '@/common';

class UpdateSupplyDtoSchema {
  @IsString()
  @TrimParam()
  code: string;

  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsEnum(SupplyUnit)
  unit: SupplyUnit;
}

export class UpdateSupplyDto extends PartialType(UpdateSupplyDtoSchema) {}

export default UpdateSupplyDto;
