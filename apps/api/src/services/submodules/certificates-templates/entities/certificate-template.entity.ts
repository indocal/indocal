import { Exclude } from 'class-transformer';
import { ServiceCertificateTemplate, FormFieldType } from '@prisma/client';

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
  SIGNATURE = 'SIGNATURE',
  IMAGE = 'IMAGE',
  SECTION = 'SECTION',
  TABLE = 'TABLE',
}

export type ServiceCertificateTemplatePlaceholderConfig = Partial<
  | ServiceCertificateTemplateTextPlaceholderConfig
  | ServiceCertificateTemplateSignaturePlaceholderConfig
  | ServiceCertificateTemplateSectionPlaceholderConfig
  | ServiceCertificateTemplateTablePlaceholderConfig
>;

export type ServiceCertificateTemplatePlaceholder = {
  type: ServiceCertificateTemplatePlaceholderType;
  name: string;
  title: string;
  config?: ServiceCertificateTemplatePlaceholderConfig;
};

////////////////////////////////
// Placeholder Config By Type //
////////////////////////////////

type Field = {
  id: UUID;
  type: FormFieldType;
  name: string;
  description: string | null;
};

export type ServiceCertificateTemplateTextPlaceholderConfig = Partial<{
  associatedField: Field;
}>;

export type ServiceCertificateTemplateSignaturePlaceholderConfig = Partial<{
  associatedField: Field;
}>;

export enum ServiceCertificateTemplateSectionPlaceholderItemType {
  TEXT = 'TEXT',
  SIGNATURE = 'SIGNATURE',
}

export type ServiceCertificateTemplateSectionPlaceholderItem = {
  type: ServiceCertificateTemplateSectionPlaceholderItemType;
  name: string;
  title: string;
};

export type ServiceCertificateTemplateSectionPlaceholderConfig = {
  items: ServiceCertificateTemplateSectionPlaceholderItem[];
};

export enum ServiceCertificateTemplateTablePlaceholderColumnType {
  TEXT = 'TEXT',
  SIGNATURE = 'SIGNATURE',
}

export type ServiceCertificateTemplateTablePlaceholderColumn = {
  type: ServiceCertificateTemplateTablePlaceholderColumnType;
  name: string;
  heading: string;
};

export type ServiceCertificateTemplateTablePlaceholderConfig = {
  columns: ServiceCertificateTemplateTablePlaceholderColumn[];
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
