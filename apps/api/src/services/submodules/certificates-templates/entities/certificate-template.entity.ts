import { Exclude } from 'class-transformer';
import { ServiceCertificateTemplate } from '@prisma/client';

import { Entity, UUID } from '@/common';

////////////
// Layout //
////////////

export enum ServiceCertificateTemplateLayoutOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

export type ServiceCertificateTemplateLayout = {
  orientation: ServiceCertificateTemplateLayoutOrientation;
};

/////////////////
// Placeholder //
/////////////////

export enum ServiceCertificateTemplatePlaceholderType {
  TEXT = 'TEXT',
  TABLE = 'TABLE',
  SIGNATURE = 'SIGNATURE',
}

export type ServiceCertificateTemplatePlaceholder = {
  type: ServiceCertificateTemplatePlaceholderType;
  name: string;
  title: string;
};

export class ServiceCertificateTemplateEntity
  implements Entity, ServiceCertificateTemplate
{
  constructor(template: ServiceCertificateTemplate) {
    Object.assign(this, template);
  }

  id: UUID;
  layout: ServiceCertificateTemplateLayout | null;
  content: string | null;
  styles: string | null;
  placeholders: ServiceCertificateTemplatePlaceholder[];

  @Exclude()
  serviceId: UUID;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceCertificateTemplateEntity;
