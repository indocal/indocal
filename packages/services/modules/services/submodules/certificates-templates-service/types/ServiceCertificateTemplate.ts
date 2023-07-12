import { Entity } from '../../../../../common';

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
  TABLE = 'TABLE',
  SIGNATURE = 'SIGNATURE',
}

export type ServiceCertificateTemplatePlaceholder = {
  type: ServiceCertificateTemplatePlaceholderType;
  name: string;
  title: string;
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
  description: string | null;
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
