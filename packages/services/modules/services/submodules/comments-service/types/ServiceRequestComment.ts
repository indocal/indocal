import { Entity } from '../../../../../common';

import { UserStatus } from '../../../../auth/submodules/users-service';

import { ServiceRequestStatus } from '../../requests-service';

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

type Request = Entity & {
  status: ServiceRequestStatus;
};

export interface ServiceRequestComment extends Entity {
  content: string;
  isInternal: boolean;
  attachments: Attachment[];
  author: Author;
  request: Request;
}

export default ServiceRequestComment;
