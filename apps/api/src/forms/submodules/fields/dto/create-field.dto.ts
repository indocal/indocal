import { IsEnum, IsString, IsOptional } from 'class-validator';
import { FormFieldType as DBFormFieldTypeEnum } from '@prisma/client';

import { TrimParam } from '@/common';

export class CreateFormFieldDto {
  @IsEnum(DBFormFieldTypeEnum)
  type: DBFormFieldTypeEnum;

  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;
}

export default CreateFormFieldDto;
