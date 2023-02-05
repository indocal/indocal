import { useRouter } from 'next/router';
import { Container } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useInventoryMovement, getShortUUID, UUID } from '@indocal/services';

import { InventoryMovementDetailsPDF } from '@/features';
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
      <Container disableGutters maxWidth={false}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : movement ? (
          <Widget sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <InventoryMovementDetailsPDF movement={movement} />
          </Widget>
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
