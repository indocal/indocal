import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { SupplyUnit as DBSupplyUnitEnum } from '@prisma/client';

import { TrimParam } from '@/common';

export class CreateSupplyDto {
  @IsString()
  @TrimParam()
  code: string;

  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @IsEnum(DBSupplyUnitEnum)
  unit: DBSupplyUnitEnum;
}

export default CreateSupplyDto;
