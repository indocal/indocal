import { Exclude } from 'class-transformer';
import { ServiceRequest, ServiceRequestStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type ServiceRequestTrackingStep = {
  id: UUID;
  title: string;
  description: string | null;
};

export type ServiceRequestTracking = {
  step: ServiceRequestTrackingStep;
  startedAt: string;
  endedAt: string | null;
};

export class ServiceRequestEntity implements Entity, ServiceRequest {
  constructor(request: ServiceRequest) {
    Object.assign(this, request);
  }

  id: UUID;
  status: ServiceRequestStatus;
  tracking: ServiceRequestTracking[];

  @Exclude()
  entryId: UUID;

  @Exclude()
  requestedById: UUID;

  @Exclude()
  currentStepId: UUID | null;

  @Exclude()
  serviceId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceRequestEntity;
