import { IsString, IsUUID, IsObject } from 'class-validator';

import { TrimParam, UUID } from '@/common';

type Item = {
  price: number;
  quantity: number;
  supply: UUID;
};

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

  @IsObject({ each: true })
  items: Item[];
}

export default CreateOrderDto;
