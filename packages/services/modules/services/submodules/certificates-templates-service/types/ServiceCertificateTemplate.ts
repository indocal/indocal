import { Entity, UUID } from '../../../../../common';

import { FormFieldType } from '../../../../forms';

import { ServiceStatus } from '../../../types';

import { ServiceRequestStatus } from '../../requests-service';

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

////////////
// Assets //
////////////

type Asset = Entity & {
  path: string;
  mime: string;
  extension: string;
  size: number;
  dimensions: number[];
  name: string;
  caption: string | null;
  alt: string | null;
};

/////////////
// Service //
/////////////

type Service = Entity & {
  title: string;
  description: string;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
};

export interface ServiceCertificateTemplate extends Entity {
  layout: ServiceCertificateTemplateLayout | null;
  content: string | null;
  styles: string | null;
  placeholders: ServiceCertificateTemplatePlaceholder[];
  assets: Asset[];
  service: Service;
}

export default ServiceCertificateTemplate;
