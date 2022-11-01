import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateFormDtoSchema {
  @IsString()
  @TrimParam()
  slug: string;

  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string | null;
}

export class UpdateFormDto extends PartialType(UpdateFormDtoSchema) {}

export default UpdateFormDto;
