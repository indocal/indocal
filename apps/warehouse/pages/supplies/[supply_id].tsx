import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useSupply, UUID } from '@indocal/services';

import {
  SupplyCard,
  SupplyPriceChartCard,
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
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : supply ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <SupplyCard supply={supply} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <SupplyPriceChartCard supply={supply} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <SupplyOrdersDataGrid supply={supply} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <SupplyMovementsList supply={supply} />
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

SupplyPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplyPage;
