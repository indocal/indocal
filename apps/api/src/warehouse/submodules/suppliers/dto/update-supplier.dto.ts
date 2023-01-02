import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateSupplierDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;
}

export class UpdateSupplierDto extends PartialType(UpdateSupplierDtoSchema) {}

export default UpdateSupplierDto;
