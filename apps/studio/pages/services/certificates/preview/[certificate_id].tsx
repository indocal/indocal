import { useRouter } from 'next/router';
import { Container } from '@mui/material';

import { Page, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useServiceCertificate, getShortUUID, UUID } from '@indocal/services';

import { ServiceCertificatePDF } from '@/features';
import { AdminDashboard } from '@/components';
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
          <ServiceCertificatePDF certificate={certificate} />
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
