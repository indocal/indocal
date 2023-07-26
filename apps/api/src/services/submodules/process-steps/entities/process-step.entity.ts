import { Exclude } from 'class-transformer';
import {
  ServiceProcessStep,
  ServiceProcessStepType,
  ServiceRequestStatus,
} from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ServiceProcessStepEntity implements Entity, ServiceProcessStep {
  constructor(step: ServiceProcessStep) {
    Object.assign(this, step);
  }

  id: UUID;
  title: string;
  description: string | null;
  type: ServiceProcessStepType;
  nextRequestStatus: ServiceRequestStatus;

  @Exclude()
  nextStepOnRejectId: UUID | null;

  @Exclude()
  nextStepOnApproveId: UUID | null;

  @Exclude()
  serviceId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceProcessStepEntity;
