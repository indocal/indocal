import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive } from 'class-validator';

class UpdateOrderItemDtoSchema {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive({ each: true })
  received: number[];
}

export class UpdateOrderItemDto extends PartialType(UpdateOrderItemDtoSchema) {}

export default UpdateOrderItemDto;
