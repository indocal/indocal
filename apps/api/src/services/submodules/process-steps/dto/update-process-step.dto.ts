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

  @IsUUID()
  @IsOptional()
  prevFailureStep: UUID | null;

  @IsUUID()
  @IsOptional()
  prevSuccessStep: UUID | null;

  @IsUUID()
  @IsOptional()
  nextFailureStep: UUID | null;

  @IsUUID()
  @IsOptional()
  nextSuccessStep: UUID | null;
}

export class UpdateServiceProcessStepDto extends PartialType(
  UpdateServiceProcessStepDtoSchema
) {}

export default UpdateServiceProcessStepDto;
