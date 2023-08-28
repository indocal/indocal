import { useRouter } from 'next/router';
import { Container } from '@mui/material';

import { Page, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { ServiceCertificatePDF } from '@indocal/services-generator';
import { useServiceCertificate, getShortUUID, UUID } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

const ServiceCertificatePreviewPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, certificate, error } = useServiceCertificate(
    router.query.certificate_id as UUID
  );

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : certificate
          ? `Certificado: ${getShortUUID(certificate.id)}`
          : 'Certificado no encontrado'
      }
    >
      <Container disableGutters maxWidth={false} sx={{ overflow: 'hidden' }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : certificate ? (
          <ServiceCertificatePDF
            certificate={certificate}
            validationPage={Pages.FORMS_PREVIEW}
          />
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

ServiceCertificatePreviewPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default ServiceCertificatePreviewPage;
