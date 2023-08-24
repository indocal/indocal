import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { FormStatus, FormVisibility } from '@prisma/client';

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

  @IsEnum(FormStatus)
  status: FormStatus;

  @IsEnum(FormVisibility)
  visibility: FormVisibility;

  @IsUUID()
  group: UUID;
}

export class UpdateFormDto extends PartialType(UpdateFormDtoSchema) {}

export default UpdateFormDto;
