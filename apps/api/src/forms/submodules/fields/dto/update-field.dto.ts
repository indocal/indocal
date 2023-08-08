import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

import { FormFieldConfig } from '../entities';
import { IsFormFieldConfig } from '../decorators';

class UpdateFormFieldDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsFormFieldConfig()
  config: FormFieldConfig;
}

export class UpdateFormFieldDto extends PartialType(UpdateFormFieldDtoSchema) {}

export default UpdateFormFieldDto;
