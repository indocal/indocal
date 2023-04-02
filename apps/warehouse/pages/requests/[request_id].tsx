import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useSupplyRequest, getShortUUID, UUID } from '@indocal/services';

import {
  SupplyRequestCard,
  SupplyRequestItemsDetails,
  SupplyRequestItemsTable,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SupplyRequestPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, request, error } = useSupplyRequest(
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
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : request ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={5}>
              <Widget>
                <SupplyRequestCard request={request} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={7}>
              <Widget>
                <SupplyRequestItemsDetails request={request} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <SupplyRequestItemsTable request={request} />
              </Widget>
            </Grid>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

SupplyRequestPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplyRequestPage;
