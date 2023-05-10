import { UUID } from '../../../../../common';

export type CreateServiceRequestCommentDto = {
  isInternal: boolean;
  content: string;
  attachments?: File[];
  author: UUID;
};

export default CreateServiceRequestCommentDto;
