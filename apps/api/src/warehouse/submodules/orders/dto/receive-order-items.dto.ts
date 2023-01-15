import { IsObject } from 'class-validator';

import { UUID } from '@/common';

type Item = {
  quantity: number;
  item: UUID;
};

export class ReceiveOrderItemsDto {
  @IsObject({ each: true })
  received: Item[];
}

export default ReceiveOrderItemsDto;
