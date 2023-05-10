import { Entity } from '../../../common';

import { UserStatus } from '../../auth';
import { FormConfig, FormStatus, FormVisibility } from '../../forms';

import { ServiceRequestStatus } from '../submodules';

type Owner = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

type SiblingStep = Entity & {
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
};

type Step = Entity & {
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
  owners: Owner[];
  prevStepOnReject: SiblingStep | null;
  prevStepOnApprove: SiblingStep | null;
  nextStepOnReject: SiblingStep | null;
  nextStepOnApprove: SiblingStep | null;
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
