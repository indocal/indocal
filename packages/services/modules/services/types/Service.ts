import { Entity } from '../../../common';

import { UserStatus } from '../../auth';
import { FormConfig, FormStatus, FormVisibility } from '../../forms';

import {
  ServiceRequestStatus,
  CertificateTemplateLayout,
  CertificateTemplatePlaceholder,
} from '../submodules';

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

///////////
// Steps //
///////////

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

//////////////
// Template //
//////////////

type Template = Entity & {
  layout: CertificateTemplateLayout | null;
  content: string | null;
  styles: string | null;
  placeholders: CertificateTemplatePlaceholder[];
};

export type ServiceStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN';

export interface Service extends Entity {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
  form: Form;
  group: Group;
  steps: Step[];
  template: Template | null;
}

export default Service;
