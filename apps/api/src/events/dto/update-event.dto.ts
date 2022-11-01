import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsDateString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateEventDtoSchema {
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

  @IsDateString()
  scheduledAt: Date;
}

export class UpdateEventDto extends PartialType(UpdateEventDtoSchema) {}

export default UpdateEventDto;
