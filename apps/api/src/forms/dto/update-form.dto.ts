import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import {
  FormStatus as DBFormStatusEnum,
  FormVisibility as DBFormVisibilityEnum,
} from '@prisma/client';

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

  @IsEnum(DBFormStatusEnum)
  status: DBFormStatusEnum;

  @IsEnum(DBFormVisibilityEnum)
  visibility: DBFormVisibilityEnum;
}

export class UpdateFormDto extends PartialType(UpdateFormDtoSchema) {}

export default UpdateFormDto;
