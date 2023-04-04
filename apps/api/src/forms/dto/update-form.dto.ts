import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FormStatus, FormVisibility } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

import { FormConfig } from '../entities';

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

  @ValidateNested()
  @Type(() => FormConfigSchema)
  config: FormConfig;
}

export class UpdateFormDto extends PartialType(UpdateFormDtoSchema) {}

export default UpdateFormDto;

////////////////////////
// FormConfig Schemas //
////////////////////////

class FormConfigWebhooksSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  url: string;
}

class FormConfigSchema {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FormConfigWebhooksSchema)
  webhooks?: FormConfigWebhooksSchema[];
}
