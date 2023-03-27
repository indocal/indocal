import { IsObject, IsUUID } from 'class-validator';

import { UUID } from '@/common';

type Item = {
  quantity: number;
  item: UUID;
};

export class ReceiveItemsDto {
  @IsObject({ each: true }) // TODO: Validate this object
  received: Item[];

  @IsUUID()
  order: UUID;
}

export default ReceiveItemsDto;
