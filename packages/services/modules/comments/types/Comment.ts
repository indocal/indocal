import { Entity } from '../../../common';

import { UserStatus } from '../../auth/submodules/users-service';

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

export interface Comment extends Entity {
  content: string;
  isInternal: boolean;
  attachments: Attachment[];
  author: Author;
}

export default Comment;
