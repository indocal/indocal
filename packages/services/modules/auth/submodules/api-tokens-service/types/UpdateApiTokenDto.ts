import { ApiTokenStatus } from './ApiToken';

export type UpdateApiTokenDto = Partial<{
  name: string;
  description: string;
  status: ApiTokenStatus;
}>;

export default UpdateApiTokenDto;
