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
  prevStepOnReject?: UUID;

  @IsUUID()
  @IsOptional()
  prevStepOnApprove?: UUID;

  @IsUUID()
  @IsOptional()
  nextStepOnReject?: UUID;

  @IsUUID()
  @IsOptional()
  nextStepOnApprove?: UUID;
}

export default CreateServiceProcessStepDto;
