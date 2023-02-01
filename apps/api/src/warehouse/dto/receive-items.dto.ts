import { IsObject, IsUUID } from 'class-validator';

import { UUID } from '@/common';

type Item = {
  quantity: number;
  item: UUID;
};

export class ReceiveItemsDto {
  @IsObject({ each: true })
  received: Item[];

  @IsUUID()
  order: UUID;
}

export default ReceiveItemsDto;
