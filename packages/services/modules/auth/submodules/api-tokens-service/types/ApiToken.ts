import { Entity } from '../../../../../common';

export type ApiTokenType = 'ANON' | 'SERVICE';
export type ApiTokenStatus = 'ENABLED' | 'DISABLED';

export interface ApiToken extends Entity {
  name: string;
  description: string;
  type: ApiTokenType;
  status: ApiTokenStatus;
}

export default ApiToken;
