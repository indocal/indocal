import { Entity } from '../../../common';

import { UserStatus } from '../../auth';

type User = Entity & {
  username: string;
  email: string;
  name: string;
  status: UserStatus;
};

export type LogMetadata = HTTPLogMetadata;

export interface Log extends Entity {
  context: string;
  action: string;
  metadata: LogMetadata | null;
  user: User | null;
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
