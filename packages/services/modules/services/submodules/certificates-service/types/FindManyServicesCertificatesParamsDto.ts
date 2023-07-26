import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyServicesCertificatesParamsDto = FindManyParams<
  Prisma.ServiceCertificateWhereInput,
  Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>,
  Prisma.Enumerable<Prisma.ServiceCertificateOrderByWithRelationInput>,
  Prisma.ServiceCertificateWhereUniqueInput
>;

export default FindManyServicesCertificatesParamsDto;
