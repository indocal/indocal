import {
  IsString,
  IsUUID,
  IsEnum,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ServiceRequestStatus } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

export class CreateServiceProcessStepDto {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @IsOptional()
  @TrimParam()
  description?: string;

  @IsEnum(ServiceRequestStatus)
  nextRequestStatus: ServiceRequestStatus;

  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  owners: UUID[];

  @IsUUID('all', { each: true })
  @IsOptional()
  prevStepsOnReject?: UUID[];

  @IsUUID('all', { each: true })
  @IsOptional()
  prevStepsOnApprove?: UUID[];

  @IsUUID()
  @IsOptional()
  nextStepOnReject?: UUID;

  @IsUUID()
  @IsOptional()
  nextStepOnApprove?: UUID;
}

export default CreateServiceProcessStepDto;
