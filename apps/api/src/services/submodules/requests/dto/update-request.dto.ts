import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsUUID } from 'class-validator';
import { ServiceRequestStatus } from '@prisma/client';

import { UUID } from '@/common';

class UpdateServiceRequestDtoSchema {
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;

  @IsUUID()
  currentStep: UUID;
}

export class UpdateServiceRequestDto extends PartialType(
  UpdateServiceRequestDtoSchema
) {}

export default UpdateServiceRequestDto;
