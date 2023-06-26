import { Entity } from '../../../../../common';

import { ServiceStatus } from '../../../types';
import { ServiceRequestStatus } from '../../requests-service';

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
  layout: CertificateTemplateLayout | null;
  content: string | null;
  styles: string | null;
  placeholders: CertificateTemplatePlaceholder[];
  service: Service;
}

export default ServiceCertificateTemplate;
