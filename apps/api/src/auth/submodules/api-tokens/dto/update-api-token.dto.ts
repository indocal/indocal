import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiTokenStatus } from '@prisma/client';

import { TrimParam } from '@/common';

class UpdateApiTokenDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsEnum(ApiTokenStatus)
  status: ApiTokenStatus;
}

export class UpdateApiTokenDto extends PartialType(UpdateApiTokenDtoSchema) {}

export default UpdateApiTokenDto;
