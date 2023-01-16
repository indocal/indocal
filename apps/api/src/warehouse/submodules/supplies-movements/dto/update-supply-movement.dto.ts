import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsPositive } from 'class-validator';

class UpdateSupplyMovementDtoSchema {
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateSupplyMovementDto extends PartialType(
  UpdateSupplyMovementDtoSchema
) {}

export default UpdateSupplyMovementDto;
