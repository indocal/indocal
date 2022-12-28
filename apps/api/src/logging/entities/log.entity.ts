import { Request } from 'express';
import { Exclude } from 'class-transformer';
import { Log as DBLogModel, User as DBUserModel } from '@prisma/client';

import { Entity, UUID } from '@/common';
import { UserEntity } from '@/auth';

type Include = Partial<{
  user?: DBUserModel | null;
}>;

export type LogMetadata = HTTPLogMetadata;

export class LogEntity implements Entity, DBLogModel {
  user?: UserEntity | null;

  constructor(log: DBLogModel, include?: Include) {
    Object.assign(this, log);

    this.user = include?.user ? new UserEntity(include.user) : null;
  }

  id: UUID;
  context: string;
  action: string;
  metadata: LogMetadata | null;

  @Exclude()
  userId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export default LogEntity;

//////////////////////
// Metadata by type //
//////////////////////

export type HTTPLogMetadata = {
  contextType: 'http';
  params?: Request['params'];
  query?: Request['query'];
  body?: Request['body'];
};
