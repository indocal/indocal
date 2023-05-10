import { UUID } from '../../../../../common';

export interface ApproveOrRejectCurrentStepDto {
  request: UUID;
  action: 'APPROVE' | 'REJECT';
  author: UUID;
  comment?: string;
  attachments?: File[];
}

export default ApproveOrRejectCurrentStepDto;
