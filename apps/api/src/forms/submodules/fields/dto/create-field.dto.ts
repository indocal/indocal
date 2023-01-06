import { IsEnum, IsString, IsOptional } from 'class-validator';
import { FormFieldType } from '@prisma/client';

import { TrimParam } from '@/common';

export class CreateFormFieldDto {
  @IsEnum(FormFieldType)
  type: FormFieldType;

  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;
}

export default CreateFormFieldDto;
