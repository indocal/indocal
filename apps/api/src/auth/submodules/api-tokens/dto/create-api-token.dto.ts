import { IsString, IsEnum } from 'class-validator';
import { ApiTokenType } from '@prisma/client';

import { TrimParam } from '@/common';

export class CreateApiTokenDto {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  description: string;

  @IsEnum(ApiTokenType)
  type: ApiTokenType;
}

export default CreateApiTokenDto;
