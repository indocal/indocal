import { OrderStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateOrderDtoSchema {
  @IsString()
  @TrimParam()
  code: string;

  @IsString()
  @TrimParam()
  concept: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class UpdateOrderDto extends PartialType(UpdateOrderDtoSchema) {}

export default UpdateOrderDto;
