import {
  IsString,
  IsUUID,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TrimParam, UUID } from '@/common';

class OrdenItem {
  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsUUID()
  supply: UUID;
}

export class CreateOrderDto {
  @IsString()
  @TrimParam()
  code: string;

  @IsString()
  @TrimParam()
  concept: string;

  @IsUUID()
  supplier: UUID;

  @IsUUID()
  requestedBy: UUID;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrdenItem)
  items: OrdenItem[];
}

export default CreateOrderDto;
