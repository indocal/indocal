import { IsUUID, IsObject } from 'class-validator';

import { UUID } from '@/common';

import { ServiceCertificateData } from '../entities';

export class CreateServiceCertificateDto {
  @IsUUID()
  template: UUID;

  @IsUUID()
  request: UUID;

  @IsObject() // TODO: Validate this object
  data: ServiceCertificateData;
}

export default CreateServiceCertificateDto;
