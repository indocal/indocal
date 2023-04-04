import {
  IsEnum,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryMovementType } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

class InventoryMovementItem {
  @IsNumber()
  quantity: number;

  @IsUUID()
  supply: UUID;
}

export class CreateInventoryMovementDto {
  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;

  @IsString()
  @TrimParam()
  concept: string;

  @IsUUID()
  @IsOptional()
  order?: UUID;

  @IsUUID()
  @IsOptional()
  origin?: UUID;

  @IsUUID()
  @IsOptional()
  destination?: UUID;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InventoryMovementItem)
  items: InventoryMovementItem[];
}

export default CreateInventoryMovementDto;
