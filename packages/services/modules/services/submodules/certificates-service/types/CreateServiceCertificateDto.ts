import { UUID } from '../../../../../common';

import { ServiceCertificateData } from './ServiceCertificate';

export type CreateServiceCertificateDto = {
  template: UUID;
  request: UUID;
  data: ServiceCertificateData;
};

export default CreateServiceCertificateDto;
