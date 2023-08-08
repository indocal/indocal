import { IsUUID } from 'class-validator';

import { UUID } from '@/common';

import { ServiceCertificateData } from '../entities';
import { IsServiceCertificateData } from '../decorators';

export class CreateServiceCertificateDto {
  @IsUUID()
  template: UUID;

  @IsUUID()
  request: UUID;

  @IsServiceCertificateData()
  data: ServiceCertificateData;
}

export default CreateServiceCertificateDto;
