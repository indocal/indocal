import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

import { TrimParam } from '@/common';

class UpdateServiceProcessStepDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;
}

export class UpdateServiceProcessStepDto extends PartialType(
  UpdateServiceProcessStepDtoSchema
) {}

export default UpdateServiceProcessStepDto;
