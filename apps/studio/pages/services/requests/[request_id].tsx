import { useRouter } from 'next/router';
import { Container, Unstable_Grid2, Stack } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { FormEntryAnswers } from '@indocal/forms-generator';
import { useServiceRequest, getShortUUID, UUID } from '@indocal/services';

import { ServiceRequestCard, ServiceCard, UserCard } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const ServiceRequestPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, request, error } = useServiceRequest(
    router.query.request_id as UUID
  );

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : request
          ? `Solicitud: ${getShortUUID(request.id)}`
          : 'Solicitud no encontrada'
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
        ) : request ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={8}>
              <Widget disableDefaultSizes>
                <FormEntryAnswers answers={request.entry.answers} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Stack spacing={1}>
                <Widget>
                  <ServiceRequestCard request={request} />
                </Widget>

                <Widget>
                  <ServiceCard service={request.service.id} />
                </Widget>

                {request.requestedBy && (
                  <Widget>
                    <UserCard user={request.requestedBy.id} />
                  </Widget>
                )}
              </Stack>
            </Unstable_Grid2>
          </Unstable_Grid2>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

ServiceRequestPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default ServiceRequestPage;
