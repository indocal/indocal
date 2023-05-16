import { UUID } from '../../../../../common';

type Comment = {
  isInternal: boolean;
  content: string;
  attachments?: File[];
  author: UUID;
};

export interface ApproveOrRejectCurrentStepDto {
  request: UUID;
  action: 'APPROVE' | 'REJECT';
  comment?: Comment;
}

export default ApproveOrRejectCurrentStepDto;
