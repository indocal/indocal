import { IsUUID, IsObject } from 'class-validator';

import { UUID } from '@/common';

type Item = {
  quantity: number;
  supply: UUID;
};

export class CreateSupplyRequestDto {
  @IsUUID()
  requestedBy: UUID;

  @IsObject({ each: true }) // TODO: Validate this object
  items: Item[];
}

export default CreateSupplyRequestDto;
