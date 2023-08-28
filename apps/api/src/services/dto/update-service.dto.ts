import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsUUID, ArrayMinSize } from 'class-validator';
import { ServiceStatus, ServiceRequestStatus } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

class UpdateServiceDtoSchema {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @TrimParam()
  description: string;

  @IsEnum(ServiceStatus)
  status: ServiceStatus;

  @IsEnum(ServiceRequestStatus, { each: true })
  @ArrayMinSize(2)
  supportedRequestStatus: ServiceRequestStatus[];

  @IsUUID()
  form: UUID;
}

export class UpdateServiceDto extends PartialType(UpdateServiceDtoSchema) {}

export default UpdateServiceDto;
