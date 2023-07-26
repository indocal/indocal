import { PartialType } from '@nestjs/mapped-types';
import { IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

import { FindManyParams, Pagination } from '@/common';

class FindManyServicesCertificatesParamsDtoSchema
  implements
    FindManyParams<
      Prisma.ServiceCertificateWhereInput,
      Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>,
      Prisma.Enumerable<Prisma.ServiceCertificateOrderByWithRelationInput>,
      Prisma.ServiceCertificateWhereUniqueInput
    >
{
  @IsObject()
  filters: Prisma.ServiceCertificateWhereInput;

  @IsObject()
  distinct: Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>;

  @IsObject()
  orderBy: Prisma.Enumerable<Prisma.ServiceCertificateOrderByWithRelationInput>;

  @IsObject()
  pagination: Pagination<Prisma.ServiceCertificateWhereUniqueInput>;
}

export class FindManyServicesCertificatesParamsDto extends PartialType(
  FindManyServicesCertificatesParamsDtoSchema
) {}

export default FindManyServicesCertificatesParamsDto;
