import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { SupplyMovementType } from '@prisma/client';

import { UUID } from '@/common';

export class CreateSupplyMovementDto {
  @IsEnum(SupplyMovementType)
  type: SupplyMovementType;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsUUID()
  supply: UUID;

  @IsUUID()
  @IsOptional()
  origin: UUID | null;

  @IsUUID()
  @IsOptional()
  destination: UUID | null;
}

export default CreateSupplyMovementDto;
