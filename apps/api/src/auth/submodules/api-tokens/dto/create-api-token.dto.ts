import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiTokenType } from '@prisma/client';

import { TrimParam } from '@/common';

export class CreateApiTokenDto {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsEnum(ApiTokenType)
  type: ApiTokenType;
}

export default CreateApiTokenDto;
