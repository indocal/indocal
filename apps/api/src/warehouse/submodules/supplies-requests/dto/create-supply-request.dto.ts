import { IsString, IsUUID, IsObject } from 'class-validator';

import { TrimParam, UUID } from '@/common';

type Item = {
  quantity: number;
  supply: UUID;
};

export class CreateSupplyRequestDto {
  @IsString()
  @TrimParam()
  description: string;

  @IsUUID()
  requestedBy: UUID;

  @IsObject({ each: true }) // TODO: Validate this object
  items: Item[];
}

export default CreateSupplyRequestDto;
