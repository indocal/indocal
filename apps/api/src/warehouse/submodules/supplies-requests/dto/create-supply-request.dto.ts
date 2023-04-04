import {
  IsString,
  IsUUID,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TrimParam, UUID } from '@/common';

class SupplyRequestItem {
  @IsNumber()
  quantity: number;

  @IsUUID()
  supply: UUID;
}

export class CreateSupplyRequestDto {
  @IsString()
  @TrimParam()
  description: string;

  @IsUUID()
  requestedBy: UUID;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SupplyRequestItem)
  items: SupplyRequestItem[];
}

export default CreateSupplyRequestDto;
