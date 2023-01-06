import { Request } from 'express';
import { Exclude } from 'class-transformer';
import { Log } from '@prisma/client';

import { Entity, UUID } from '@/common';

export type LogMetadata = HTTPLogMetadata;

export class LogEntity implements Entity, Log {
  constructor(log: Log) {
    Object.assign(this, log);
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
