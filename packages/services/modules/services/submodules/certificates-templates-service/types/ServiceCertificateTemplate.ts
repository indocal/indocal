import { Entity } from '../../../../../common';

import { ServiceStatus } from '../../../types';
import { ServiceRequestStatus } from '../../requests-service';

import PageSizes from './PageSizes';

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

////////////////
// Background //
////////////////

type Background = Entity & {
  path: string;
  mime: string;
  extension: string;
  size: number;
  dimensions: number[];
  name: string;
  caption: string | null;
  alt: string | null;
};

/////////////////
// Placeholder //
/////////////////

export type Placeholder = {
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
  background: Background | null;
  design: Design;
  content: string | null;
  styles: string | null;
  placeholders: Placeholder[];
  service: Service;
}

export default ServiceCertificateTemplate;
