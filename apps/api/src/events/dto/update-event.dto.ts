import { EventStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

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
  description: string | null;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsDateString()
  scheduledAt: Date;
}

export class UpdateEventDto extends PartialType(UpdateEventDtoSchema) {}

export default UpdateEventDto;
