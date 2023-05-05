import { Exclude } from 'class-transformer';
import { ServiceProcessStep } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ServiceProcessStepEntity implements Entity, ServiceProcessStep {
  constructor(step: ServiceProcessStep) {
    Object.assign(this, step);
  }

  id: UUID;
  title: string;
  description: string | null;

  @Exclude()
  nextStepOnRejectId: string | null;

  @Exclude()
  nextStepOnApproveId: string | null;

  @Exclude()
  serviceId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceProcessStepEntity;
