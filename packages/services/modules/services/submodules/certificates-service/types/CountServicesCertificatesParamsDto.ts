import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountServicesCertificatesParamsDto = CountParams<
  Prisma.ServiceCertificateWhereInput,
  Prisma.Enumerable<Prisma.ServiceCertificateScalarFieldEnum>
>;

export default CountServicesCertificatesParamsDto;
