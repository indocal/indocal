import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum } from 'class-validator';
import { ApiTokenStatus } from '@prisma/client';

import { TrimParam } from '@/common';

class UpdateApiTokenDtoSchema {
  @IsString()
  @TrimParam()
  name: string;

  @IsString()
  @TrimParam()
  description: string;

  @IsEnum(ApiTokenStatus)
  status: ApiTokenStatus;
}

export class UpdateApiTokenDto extends PartialType(UpdateApiTokenDtoSchema) {}

export default UpdateApiTokenDto;
