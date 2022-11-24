import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import {
  FormStatus as DBFormStatusEnum,
  FormVisibility as DBFormVisibilityEnum,
} from '@prisma/client';

import { TrimParam, UUID } from '@/common';

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
  description: string | null;

  @IsEnum(DBFormStatusEnum)
  status: DBFormStatusEnum;

  @IsEnum(DBFormVisibilityEnum)
  visibility: DBFormVisibilityEnum;

  @IsUUID()
  group: UUID;
}

export class UpdateFormDto extends PartialType(UpdateFormDtoSchema) {}

export default UpdateFormDto;
