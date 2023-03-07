import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsObject, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

import { FormFieldConfig } from '../entities';

class UpdateFormFieldDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsObject() // TODO: Validate this object
  config: FormFieldConfig;
}

export class UpdateFormFieldDto extends PartialType(UpdateFormFieldDtoSchema) {}

export default UpdateFormFieldDto;
