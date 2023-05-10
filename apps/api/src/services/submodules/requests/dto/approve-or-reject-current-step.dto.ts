import { IsUUID, IsEnum, IsString, IsOptional } from 'class-validator';

import { UUID } from '@/common';

export class ApproveOrRejectCurrentStepDto {
  @IsUUID()
  request: UUID;

  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsUUID()
  author: UUID;

  @IsString()
  @IsOptional()
  comment?: string;
}

export default ApproveOrRejectCurrentStepDto;
