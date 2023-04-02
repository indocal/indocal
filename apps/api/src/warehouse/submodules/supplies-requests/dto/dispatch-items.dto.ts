import { IsObject, IsUUID } from 'class-validator';

import { UUID } from '@/common';

type Item = {
  quantity: number;
  item: UUID;
};

export class DispatchItemsDto {
  @IsObject({ each: true }) // TODO: Validate this object
  received: Item[];

  @IsUUID()
  request: UUID;
}

export default DispatchItemsDto;
