import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsObject, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateFormFieldDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string | null;

  @IsObject()
  config: object;
}

export class UpdateFormFieldDto extends PartialType(UpdateFormFieldDtoSchema) {}

export default UpdateFormFieldDto;
