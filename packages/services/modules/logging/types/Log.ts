import { Entity, UUID } from '../../../common';

import { UserStatus } from '../../auth';

type User = {
  id: UUID;
  username: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export type LogMetadata = HTTPLogMetadata;

export interface Log extends Entity {
  context: string;
  action: string;
  metadata: LogMetadata | null;
  user: User | null;
  createdAt: string;
  updatedAt: string;
}

export default Log;

//////////////////////
// Metadata by type //
//////////////////////

export type HTTPLogMetadata = {
  contextType: 'http';
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
};
