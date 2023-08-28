import { Exclude } from 'class-transformer';
import { Service, ServiceStatus, ServiceRequestStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ServiceEntity implements Entity, Service {
  constructor(service: Service) {
    Object.assign(this, service);
  }

  id: UUID;
  title: string;
  description: string;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];

  @Exclude()
  formId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceEntity;
