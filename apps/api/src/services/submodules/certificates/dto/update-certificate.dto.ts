import { PartialType } from '@nestjs/mapped-types';

import { IsUUID, IsObject } from 'class-validator';

import { UUID } from '@/common';

import { ServiceCertificateData } from '../entities';

class UpdateServiceCertificateDtoSchema {
  @IsUUID()
  template: UUID;

  @IsUUID()
  request: UUID;

  @IsObject() // TODO: Validate this object
  data: ServiceCertificateData;
}

export class UpdateServiceCertificateDto extends PartialType(
  UpdateServiceCertificateDtoSchema
) {}

export default UpdateServiceCertificateDto;
