import { Entity } from '../../../../../common';

import { FormFieldAnswer } from '../../../../forms';
import { UserStatus } from '../../../../auth';

import { ServiceStatus } from '../../../types';

type Entry = Entity & {
  answers: FormFieldAnswer[];
};

type RequestedBy = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

type Service = Entity & {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
};

type CurrentStep = Entity & {
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
  owners: Owner[];
  prevStepOnReject: SiblingStep | null;
  prevStepOnApprove: SiblingStep | null;
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
  nextRequestStatus: ServiceRequestStatus;
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
}

export default ServiceRequest;
