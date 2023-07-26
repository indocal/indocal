import { Exclude } from 'class-transformer';
import { ServiceCertificate } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type ServiceCertificateData = Record<string, string>;

export class ServiceCertificateEntity implements Entity, ServiceCertificate {
  constructor(certificate: ServiceCertificate) {
    Object.assign(this, certificate);
  }

  id: UUID;
  data: ServiceCertificateData;

  @Exclude()
  templateId: UUID;

  @Exclude()
  requestId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceCertificateEntity;
