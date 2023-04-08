import { Entity } from '../../../common';

import { ApiTokenType, ApiTokenStatus, UserStatus } from '../../auth';

type ApiToken = Entity & {
  name: string;
  description: string;
  type: ApiTokenType;
  status: ApiTokenStatus;
};

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
  apiToken: ApiToken | null;
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
