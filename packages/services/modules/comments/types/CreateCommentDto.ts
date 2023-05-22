import { UUID } from '../../../common';

export type AttachModel = 'request';

export const AttachModel = { REQUEST: 'request' };

type Attach = {
  model: AttachModel;
  entity: UUID;
};

export type CreateCommentDto = {
  isInternal: boolean;
  content: string;
  attachments?: File[];
  author: UUID;
  attach: Attach;
};

export default CreateCommentDto;
