import { Exclude } from 'class-transformer';
import { ServiceCertificateTemplate } from '@prisma/client';

import { Entity, UUID } from '@/common';

import { PageSizes } from '../types';

////////////
// Design //
////////////

export type QR = {
  include: boolean;
  size: number;
};

export type Design = {
  size: PageSizes;
  qr: QR;
};

/////////////////
// Placeholder //
/////////////////

export type Placeholder = {
  name: string;
};

export class ServiceCertificateTemplateEntity
  implements Entity, ServiceCertificateTemplate
{
  constructor(template: ServiceCertificateTemplate) {
    Object.assign(this, template);
  }

  id: UUID;
  design: Design;
  content: string | null;
  styles: string | null;
  placeholders: Placeholder[];

  @Exclude()
  serviceId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceCertificateTemplateEntity;
