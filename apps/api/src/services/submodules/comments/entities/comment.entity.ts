import { Exclude } from 'class-transformer';
import { ServiceRequestComment } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ServiceRequestCommentEntity
  implements Entity, ServiceRequestComment
{
  constructor(comment: ServiceRequestComment) {
    Object.assign(this, comment);
  }

  id: UUID;
  content: string;
  isInternal: boolean;

  @Exclude()
  authorId: string;

  @Exclude()
  requestId: string;

  createdAt: Date;
  updatedAt: Date;
}

export default ServiceRequestCommentEntity;
