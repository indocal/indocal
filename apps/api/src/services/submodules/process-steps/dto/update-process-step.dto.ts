import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsUUID,
  IsEnum,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ServiceProcessStepType, ServiceRequestStatus } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

class UpdateServiceProcessStepDtoSchema {
  @IsEnum(ServiceProcessStepType)
  type: ServiceProcessStepType;

  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description: string | null;

  @IsEnum(ServiceRequestStatus)
  nextRequestStatus: ServiceRequestStatus;

  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  owners: UUID[];

  @IsUUID('all', { each: true })
  @IsOptional()
  prevStepsOnReject: UUID[];

  @IsUUID('all', { each: true })
  @IsOptional()
  prevStepsOnApprove: UUID[];

  @IsUUID()
  @IsOptional()
  nextStepOnReject: UUID | null;

  @IsUUID()
  @IsOptional()
  nextStepOnApprove: UUID | null;
}

export class UpdateServiceProcessStepDto extends PartialType(
  UpdateServiceProcessStepDtoSchema
) {}

export default UpdateServiceProcessStepDto;
