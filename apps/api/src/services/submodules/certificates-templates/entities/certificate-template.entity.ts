import { Exclude } from 'class-transformer';
import { ServiceCertificateTemplate } from '@prisma/client';

import { Entity, UUID } from '@/common';

////////////
// Layout //
////////////

export enum CertificateTemplateLayoutOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

export type CertificateTemplateLayout = {
  orientation: CertificateTemplateLayoutOrientation;
};

/////////////////
// Placeholder //
/////////////////

export type CertificateTemplatePlaceholder = {
  name: string;
};

export class ServiceCertificateTemplateEntity
  implements Entity, ServiceCertificateTemplate
{
  constructor(template: ServiceCertificateTemplate) {
    Object.assign(this, template);
  }

  id: UUID;
  layout: CertificateTemplateLayout | null;
  content: string | null;
  styles: string | null;
  placeholders: CertificateTemplatePlaceholder[];

  @Exclude()
  serviceId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceCertificateTemplateEntity;
