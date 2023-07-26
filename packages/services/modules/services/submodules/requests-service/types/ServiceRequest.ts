import { Entity } from '../../../../../common';

import { FormFieldAnswer } from '../../../../forms';
import { UserStatus } from '../../../../auth';

import { ServiceStatus } from '../../../types';

import { ServiceProcessStepType } from '../../process-steps-service';
import { ServiceCertificateData } from '../../certificates-service';

///////////
// Forms //
///////////

type Entry = Entity & {
  answers: FormFieldAnswer[];
};

type RequestedBy = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
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

///////////
// Steps //
///////////

type CurrentStep = Entity & {
  title: string;
  description: string | null;
  type: ServiceProcessStepType;
  nextRequestStatus: ServiceRequestStatus;
  owners: Owner[];
  prevStepsOnReject: SiblingStep[];
  prevStepsOnApprove: SiblingStep[];
  nextStepOnReject: SiblingStep | null;
  nextStepOnApprove: SiblingStep | null;
};

type Owner = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

type SiblingStep = Entity & {
  title: string;
  description: string | null;
  type: ServiceProcessStepType;
  nextRequestStatus: ServiceRequestStatus;
};

//////////////////
// Certificates //
//////////////////

type Certificate = Entity & {
  data: ServiceCertificateData;
};

//////////////
// Comments //
//////////////

type Comment = Entity & {
  content: string;
  isInternal: boolean;
  attachments: Attachment[];
  author: Author;
};

type Attachment = Entity & {
  path: string;
  mime: string;
  extension: string;
  size: number;
  dimensions: number[];
  name: string;
  caption: string | null;
  alt: string | null;
};

type Author = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

export type ServiceRequestStatus =
  | 'PENDING'
  | 'PENDING_APPROVAL'
  | 'PENDING_PAYMENT'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELED';

export interface ServiceRequest extends Entity {
  status: ServiceRequestStatus;
  entry: Entry;
  requestedBy: RequestedBy;
  service: Service;
  currentStep: CurrentStep | null;
  certificates: Certificate[];
  comments: Comment[];
}

export default ServiceRequest;
