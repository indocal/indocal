import { ApiTokenType } from './ApiToken';

export type CreateApiTokenDto = {
  name: string;
  description?: string;
  type: ApiTokenType;
};

export default CreateApiTokenDto;
