import { IsString, IsEnum, IsUUID, ArrayMinSize } from 'class-validator';
import { ServiceRequestStatus } from '@prisma/client';

import { TrimParam, UUID } from '@/common';

export class CreateServiceDto {
  @IsString()
  @TrimParam()
  title: string;

  @IsString()
  @TrimParam()
  description: string;

  @IsEnum(ServiceRequestStatus, { each: true })
  @ArrayMinSize(2)
  supportedRequestStatus: ServiceRequestStatus[];

  @IsUUID()
  form: UUID;
}

export default CreateServiceDto;
