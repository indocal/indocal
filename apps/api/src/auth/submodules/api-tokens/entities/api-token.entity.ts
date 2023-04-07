import { Exclude } from 'class-transformer';
import { ApiToken, ApiTokenType, ApiTokenStatus } from '@prisma/client';

import { Entity, UUID } from '@/common';

export class ApiTokenEntity implements Entity, ApiToken {
  constructor(apiToken: ApiToken) {
    Object.assign(this, apiToken);
  }

  id: UUID;
  name: string;
  description: string;

  @Exclude()
  token: string;

  type: ApiTokenType;
  status: ApiTokenStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default ApiTokenEntity;
