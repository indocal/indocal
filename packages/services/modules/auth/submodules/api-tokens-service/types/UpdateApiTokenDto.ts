import { ApiTokenStatus } from './ApiToken';

export type UpdateApiTokenDto = Partial<{
  name: string;
  description: string | null;
  status: ApiTokenStatus;
}>;

export default UpdateApiTokenDto;
