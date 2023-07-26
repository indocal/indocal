import { Entity } from '../../../../../common';

import { UserStatus } from '../../../../auth/submodules/users-service';

import { ServiceStatus } from '../../../types';

import { ServiceRequestStatus } from '../../requests-service';

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

type Service = Entity & {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
};

export type ServiceProcessStepType = 'START' | 'DUMMY' | 'END';

export interface ServiceProcessStep extends Entity {
  title: string;
  description: string | null;
  nextRequestStatus: ServiceRequestStatus;
  owners: Owner[];
  prevStepsOnReject: SiblingStep[];
  nextStepOnReject: SiblingStep | null;
  prevStepsOnApprove: SiblingStep[];
  nextStepOnApprove: SiblingStep | null;
  service: Service;
}

export default ServiceProcessStep;
