import { GetServerSideProps } from 'next';

import { Page, Widget } from '@indocal/ui';
import { ServiceCertificatePDF } from '@indocal/services-generator';
import { getShortUUID, UUID, ServiceCertificate } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type CertificatePageParams = {
  certificate_id: UUID;
};

type CertificatePageProps = {
  certificate: ServiceCertificate;
};

const CertificatePage: EnhancedNextPage<CertificatePageProps> = ({
  certificate,
}) => (
  <Page title={`Certificado: ${getShortUUID(certificate.id)}`}>
    <Widget
      disableDefaultSizes
      sx={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      <ServiceCertificatePDF
        certificate={certificate}
        validationPage={Pages.SERVICES_CERTIFICATES_VALIDATOR}
      />
    </Widget>
  </Page>
);

export const getServerSideProps: GetServerSideProps<
  CertificatePageProps,
  CertificatePageParams
> = async (ctx) => {
  const { certificate } = await indocal.services.certificates.findOneByUUID(
    ctx.params?.certificate_id as UUID
  );

  if (!certificate) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      certificate,
    },
  };
};

export default CertificatePage;
