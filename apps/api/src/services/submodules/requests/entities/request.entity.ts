import { Exclude } from 'class-transformer';
import { ServiceRequest, ServiceRequestStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ServiceRequestEntity implements Entity, ServiceRequest {
  constructor(request: ServiceRequest) {
    Object.assign(this, request);
  }

  id: UUID;
  status: ServiceRequestStatus;

  @Exclude()
  entryId: string;

  @Exclude()
  requestedById: string;

  @Exclude()
  currentStepId: string | null;

  @Exclude()
  serviceId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceRequestEntity;
