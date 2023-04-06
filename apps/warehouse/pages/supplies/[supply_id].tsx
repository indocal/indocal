import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useSupply, UUID } from '@indocal/services';

import {
  SupplyCard,
  SupplyPricesChart,
  SupplyOrdersDataGrid,
  SupplyMovementsList,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SupplyPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, supply, error } = useSupply(router.query.supply_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : supply
          ? `Recurso: ${supply.name}`
          : 'Recurso no encontrado'
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
        ) : supply ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplyCard supply={supply} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={8}>
              <Widget>
                <SupplyPricesChart supply={supply} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={7}>
              <Widget>
                <SupplyOrdersDataGrid supply={supply} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={5}>
              <Widget>
                <SupplyMovementsList supply={supply} />
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

SupplyPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplyPage;
