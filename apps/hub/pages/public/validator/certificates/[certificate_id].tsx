import { GetServerSideProps } from 'next';
import {
  Container,
  Unstable_Grid2,
  Alert,
  AlertTitle,
  Typography,
} from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import {
  getShortUUID,
  UUID,
  ServiceCertificate,
  ServiceRequest,
} from '@indocal/services';

import { indocal } from '@/lib';
import { ServiceCertificateCard, ServiceCard } from '@/features';
import { EnhancedNextPage } from '@/types';

type CertificateValidatorPageParams = {
  certificate_id: UUID;
};

type CertificateValidatorPageProps = {
  certificate: ServiceCertificate;
  request: ServiceRequest;
};

const CertificateValidatorPage: EnhancedNextPage<
  CertificateValidatorPageProps
> = ({ certificate, request }) => (
  <Page title={`Certificado: ${getShortUUID(certificate.id)}`}>
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ height: 'fit-content' }}
      >
        <Unstable_Grid2 xs={12}>
          <Alert severity="success">
            <AlertTitle>Certificado legítimo 🎉🎊</AlertTitle>

            <Typography>
              Este certificado fue expedido por el Instituto Dominicano para la
              Calidad (INDOCAL).
            </Typography>
          </Alert>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={7}>
          <Widget>
            <ServiceCertificateCard certificate={certificate} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={5}>
          <Widget>
            <ServiceCard service={request.service} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

export const getServerSideProps: GetServerSideProps<
  CertificateValidatorPageProps,
  CertificateValidatorPageParams
> = async (ctx) => {
  const { certificate } = await indocal.services.certificates.findOneByUUID(
    ctx.params?.certificate_id as UUID
  );

  if (!certificate) {
    return {
      notFound: true,
    };
  }

  const { request } = await indocal.services.requests.findOneByUUID(
    certificate.request.id
  );

  if (!request) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      certificate,
      request,
    },
  };
};

export default CertificateValidatorPage;
