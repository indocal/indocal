import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { ServiceRequestStatus } from '@prisma/client';

class UpdateServiceRequestDtoSchema {
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;
}

export class UpdateServiceRequestDto extends PartialType(
  UpdateServiceRequestDtoSchema
) {}

export default UpdateServiceRequestDto;
