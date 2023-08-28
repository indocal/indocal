import { UUID } from '../../../common';

import { ServiceRequestStatus } from '../submodules';

export type CreateServiceDto = {
  title: string;
  description: string;
  supportedRequestStatus: ServiceRequestStatus[];
  form: UUID;
};

export default CreateServiceDto;
