import { Entity } from '../../../common';

import { FormConfig, FormStatus, FormVisibility } from '../../forms';

import { ServiceRequestStatus } from '../submodules';

type SiblingStep = Entity & {
  title: string;
  description: string | null;
};

type Step = Entity & {
  title: string;
  description: string | null;
  prevFailureStep: SiblingStep | null;
  prevSuccessStep: SiblingStep | null;
  nextFailureStep: SiblingStep | null;
  nextSuccessStep: SiblingStep | null;
};

type Form = Entity & {
  slug: string;
  title: string;
  description: string | null;
  config: FormConfig | null;
  status: FormStatus;
  visibility: FormVisibility;
};

type Group = Entity & {
  name: string;
  description: string | null;
};

export type ServiceStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface Service extends Entity {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
  steps: Step[];
  form: Form;
  group: Group;
}

export default Service;
