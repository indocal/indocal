import { Entity } from '../../../../../common';

import { ServiceStatus } from '../../../types';

import { ServiceRequestStatus } from '../../requests-service/types';

type SiblingStep = Entity & {
  title: string;
  description: string | null;
};

type Service = Entity & {
  title: string;
  description: string | null;
  status: ServiceStatus;
  supportedRequestStatus: ServiceRequestStatus[];
};

export interface ServiceProcessStep extends Entity {
  title: string;
  description: string | null;
  prevFailureStep: SiblingStep | null;
  nextFailureStep: SiblingStep | null;
  prevSuccessStep: SiblingStep | null;
  nextSuccessStep: SiblingStep | null;
  service: Service;
}

export default ServiceProcessStep;
