import { UUID } from '../../../../../common';

import { ServiceCertificateData } from './ServiceCertificate';

export type UpdateServiceCertificateDto = Partial<{
  template: UUID;
  request: UUID;
  data: ServiceCertificateData;
}>;

export default UpdateServiceCertificateDto;
