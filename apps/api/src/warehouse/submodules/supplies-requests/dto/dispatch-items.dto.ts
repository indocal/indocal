import {
  IsUUID,
  IsNumber,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UUID } from '@/common';

class Item {
  @IsNumber()
  quantity: number;

  @IsUUID()
  item: UUID;
}

export class DispatchItemsDto {
  @IsUUID()
  request: UUID;

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Item)
  received: Item[];
}

export default DispatchItemsDto;
