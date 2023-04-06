import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Stat } from '@indocal/ui';
import {
  useSuppliesCount,
  useSuppliersCount,
  useOrdersCount,
} from '@indocal/services';

import { InventoryMovementsByGroupChart } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => {
  const {
    loading: suppliesCountLoading,
    validating: suppliesCountValidating,
    count: suppliesCount,
  } = useSuppliesCount();

  const {
    loading: suppliersCountLoading,
    validating: suppliersCountValidating,
    count: suppliersCount,
  } = useSuppliersCount();

  const {
    loading: ordersCountLoading,
    validating: ordersCountValidating,
    count: ordersCount,
  } = useOrdersCount();

  return (
    <Page title="Dashboard" transition="down">
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
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            xs={12}
          >
            <Unstable_Grid2>
              <Stat
                title="Recursos"
                description="Recursos registrados"
                value={suppliesCount ?? 'N/A'}
                loading={suppliesCountLoading}
                validating={suppliesCountValidating}
              />
            </Unstable_Grid2>

            <Unstable_Grid2>
              <Stat
                title="Suplidores"
                description="Suplidores registrados"
                value={suppliersCount ?? 'N/A'}
                loading={suppliersCountLoading}
                validating={suppliersCountValidating}
              />
            </Unstable_Grid2>

            <Unstable_Grid2>
              <Stat
                title="Ordenes"
                description="Ordenes realizadas"
                value={ordersCount ?? 'N/A'}
                loading={ordersCountLoading}
                validating={ordersCountValidating}
              />
            </Unstable_Grid2>
          </Unstable_Grid2>

          <Unstable_Grid2 xs={12}>
            <Widget>
              <InventoryMovementsByGroupChart />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Container>
    </Page>
  );
};

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
