import { IsString, IsUUID, ArrayMinSize, IsOptional } from 'class-validator';

import { TrimParam, UUID } from '@/common';

export class CreateServiceProcessStepDto {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  owners: UUID[];

  @IsUUID()
  @IsOptional()
  prevFailureStep?: UUID;

  @IsUUID()
  @IsOptional()
  prevSuccessStep?: UUID;

  @IsUUID()
  @IsOptional()
  nextFailureStep?: UUID;

  @IsUUID()
  @IsOptional()
  nextSuccessStep?: UUID;
}

export default CreateServiceProcessStepDto;
