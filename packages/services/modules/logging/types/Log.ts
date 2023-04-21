import { Entity } from '../../../common';

import { JWT } from '../../auth';

export type LogMetadata = HTTPLogMetadata;

export interface Log extends Entity {
  context: string;
  action: string;
  metadata: LogMetadata | null;
  authentication: JWT | null;
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
