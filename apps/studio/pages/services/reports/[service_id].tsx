import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { ServiceRequestsPerMonthChart } from '@indocal/services-generator';
import { useService, UUID } from '@indocal/services';

import { ServiceCard } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const ServiceReportsPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, service, error } = useService(
    router.query.service_id as UUID
  );

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : service
          ? `Servicio: ${service.title}`
          : 'Servicio no encontrado'
      }
    >
      <Container
        fixed
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : service ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <ServiceCard service={service} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={8}>
              <Widget>
                <ServiceRequestsPerMonthChart service={service} />
              </Widget>
            </Unstable_Grid2>
          </Unstable_Grid2>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

ServiceReportsPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default ServiceReportsPage;
