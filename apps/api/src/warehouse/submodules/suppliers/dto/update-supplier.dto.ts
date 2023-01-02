import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateWarehouseSupplierDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;
}

export class UpdateWarehouseSupplierDto extends PartialType(
  UpdateWarehouseSupplierDtoSchema
) {}

export default UpdateWarehouseSupplierDto;
