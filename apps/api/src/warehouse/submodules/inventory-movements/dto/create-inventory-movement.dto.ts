import {
  IsEnum,
  IsString,
  IsObject,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { InventoryMovementType } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

type Item = {
  quantity: number;
  supply: UUID;
};

export class CreateInventoryMovementDto {
  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;

  @IsString()
  @TrimParam()
  concept: string;

  @IsObject({ each: true })
  items: Item[];

  @IsUUID()
  @IsOptional()
  order?: UUID;

  @IsUUID()
  @IsOptional()
  origin?: UUID;

  @IsUUID()
  @IsOptional()
  destination?: UUID;
}

export default CreateInventoryMovementDto;
