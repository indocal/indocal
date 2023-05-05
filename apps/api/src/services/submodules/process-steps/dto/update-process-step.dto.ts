import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID, ArrayMinSize, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

class UpdateServiceProcessStepDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  owners: UUID[];
}

export class UpdateServiceProcessStepDto extends PartialType(
  UpdateServiceProcessStepDtoSchema
) {}

export default UpdateServiceProcessStepDto;
