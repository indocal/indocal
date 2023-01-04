import { IsString, IsUUID } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateOrderDto {
  @IsString()
  @TrimParam()
  code: string;

  @IsUUID()
  supplier: UUID;
}

export default CreateOrderDto;
