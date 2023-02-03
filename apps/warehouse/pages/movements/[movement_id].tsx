import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useInventoryMovement, getShortUUID, UUID } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const InventoryMovementPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, movement, error } = useInventoryMovement(
    router.query.movement_id as UUID
  );

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : movement
          ? `Movimiento: ${getShortUUID(movement.id)}`
          : 'Movimiento no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : movement ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Widget disableDefaultSizes></Widget>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

InventoryMovementPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default InventoryMovementPage;
