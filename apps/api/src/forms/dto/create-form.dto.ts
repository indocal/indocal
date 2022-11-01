import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

export class CreateFormDto {
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
}

export default CreateFormDto;
