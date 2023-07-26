import { Entity } from '../../../../../common';

import { ServiceStatus } from '../../../types';

import {
  ServiceCertificateTemplateLayout,
  ServiceCertificateTemplatePlaceholder,
} from '../../certificates-templates-service';

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

type Template = Entity & {
  layout: ServiceCertificateTemplateLayout;
  content: string | null;
  styles: string | null;
  placeholders: ServiceCertificateTemplatePlaceholder[];
  assets: Asset[];
};

type Request = Entity & {
  status: ServiceStatus;
};

export type ServiceCertificateData = Record<string, string>;

export interface ServiceCertificate extends Entity {
  data: ServiceCertificateData;
  template: Template;
  request: Request;
}

export default ServiceCertificate;
