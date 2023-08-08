import { PartialType } from '@nestjs/mapped-types';

import { IsUUID } from 'class-validator';

import { UUID } from '@/common';

import { ServiceCertificateData } from '../entities';
import { IsServiceCertificateData } from '../decorators';

class UpdateServiceCertificateDtoSchema {
  @IsUUID()
  template: UUID;

  @IsUUID()
  request: UUID;

  @IsServiceCertificateData()
  data: ServiceCertificateData;
}

export class UpdateServiceCertificateDto extends PartialType(
  UpdateServiceCertificateDtoSchema
) {}

export default UpdateServiceCertificateDto;
