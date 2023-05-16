import {
  IsUUID,
  IsEnum,
  IsBooleanString,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UUID } from '@/common';

class Comment {
  @IsBooleanString()
  isInternal: string;

  @IsString()
  content: string;

  @IsUUID()
  author: UUID;
}

export class ApproveOrRejectCurrentStepDto {
  @IsUUID()
  request: UUID;

  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';

  @IsOptional()
  @ValidateNested()
  @Type(() => Comment)
  comment?: Comment;
}

export default ApproveOrRejectCurrentStepDto;
