import { IsString, IsDateString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateEventDto {
  @IsString()
  @TrimParam()
  slug: string;

  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsDateString()
  scheduledAt: Date;
}

export default CreateEventDto;
