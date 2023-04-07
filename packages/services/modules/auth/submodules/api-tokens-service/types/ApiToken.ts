import { Entity } from '../../../../../common';

export type ApiTokenType = 'READ_ONLY' | 'READ_WRITE';
export type ApiTokenStatus = 'ENABLED' | 'DISABLED';

export interface ApiToken extends Entity {
  name: string;
  description: string;
  token: string;
  type: ApiTokenType;
  status: ApiTokenStatus;
}

export default ApiToken;
