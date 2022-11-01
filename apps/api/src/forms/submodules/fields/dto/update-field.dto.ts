import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateFormFieldDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string | null;
}

export class UpdateFormFieldDto extends PartialType(UpdateFormFieldDtoSchema) {}

export default UpdateFormFieldDto;
