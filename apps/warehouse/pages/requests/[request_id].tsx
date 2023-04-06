import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useSupplyRequest, getShortUUID, UUID } from '@indocal/services';

import {
  SupplyRequestCard,
  SupplyRequestItemsDetails,
  SupplyRequestMovementsList,
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
            alignItems="center"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplyRequestCard request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplyRequestItemsDetails request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplyRequestMovementsList request={request} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <SupplyRequestItemsTable request={request} />
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

SupplyRequestPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplyRequestPage;
