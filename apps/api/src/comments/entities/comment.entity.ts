import { Exclude } from 'class-transformer';
import { Comment } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class CommentEntity implements Entity, Comment {
  constructor(comment: Comment) {
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

export default CommentEntity;
