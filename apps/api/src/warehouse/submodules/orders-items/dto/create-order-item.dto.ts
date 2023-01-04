import { IsNumber, IsPositive, IsUUID } from 'class-validator';

import { UUID } from '@/common';

export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsUUID()
  supply: UUID;
}

export default CreateOrderItemDto;
