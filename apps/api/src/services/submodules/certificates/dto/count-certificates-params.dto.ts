import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { CountParams } from '@/common';

class CountServicesCertificatesParamsDtoSchema
  implements
    CountParams<
      Prisma.ServiceCertificateWhereInput,
      Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>
    >
{
  @IsObject()
  filters: Prisma.ServiceCertificateWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>;
}

export class CountServicesCertificatesParamsDto extends PartialType(
  CountServicesCertificatesParamsDtoSchema
) {}

export default CountServicesCertificatesParamsDto;
