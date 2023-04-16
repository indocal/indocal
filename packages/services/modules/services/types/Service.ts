import { Entity } from '../../../common';

import { FormConfig, FormStatus, FormVisibility } from '../../forms';

import { ServiceRequestStatus } from '../submodules';

type Form = Entity & {
  slug: string;
  title: string;
  description: string | null;
  config: FormConfig | null;
  status: FormStatus;
  visibility: FormVisibility;
};

export type ServiceStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface Service extends Entity {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
  form: Form;
}

export default Service;
