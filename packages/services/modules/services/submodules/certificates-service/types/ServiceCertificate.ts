import { Entity } from '../../../../../common';

import { UserStatus } from '../../../../auth';

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

type User = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

export type ServiceCertificateData =
  | Record<string, string>
  | Record<string, Array<Record<string, string>>>;

export interface ServiceCertificate extends Entity {
  data: ServiceCertificateData;
  template: Template;
  request: Request;
  user: User;
}

export default ServiceCertificate;
