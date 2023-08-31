import { useRouter } from 'next/router';
import { Container, Unstable_Grid2, Typography } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { ServiceRequestTimeline } from '@indocal/services-generator';
import { FormEntryAnswers } from '@indocal/forms-generator';
import { useServiceRequest, getShortUUID, UUID } from '@indocal/services';

import {
  ServiceRequestCard,
  ServiceCard,
  UserCard,
  ServiceRequestStepper,
  ServiceRequestComments,
} from '@/features';
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
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <ServiceRequestCard request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <ServiceCard service={request.service.id} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserCard user={request.requestedBy.id} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={7}>
              <Widget sx={{ height: 350 }}>
                <ServiceRequestStepper request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={5}>
              <Widget sx={{ height: 350 }}>
                <ServiceRequestComments request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget sx={{ height: 400 }}>
                <ServiceRequestTimeline request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  margin: (theme) => theme.spacing(4),
                  alignItems: 'center',
                  '::before': {
                    content: '""',
                    flexGrow: 1,
                    marginRight: (theme) => theme.spacing(2),
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  },
                  '::after': {
                    content: '""',
                    flexGrow: 1,
                    marginLeft: (theme) => theme.spacing(2),
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  },
                }}
              >
                Datos capturados en el formulario
              </Typography>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <FormEntryAnswers answers={request.entry.answers} />
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

ServiceRequestPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default ServiceRequestPage;
