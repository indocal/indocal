import { OrderStatus as DBOrderStatusEnum } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateOrderDtoSchema {
  @IsString()
  @TrimParam()
  code: string;

  @IsEnum(DBOrderStatusEnum)
  status: DBOrderStatusEnum;
}

export class UpdateOrderDto extends PartialType(UpdateOrderDtoSchema) {}

export default UpdateOrderDto;
