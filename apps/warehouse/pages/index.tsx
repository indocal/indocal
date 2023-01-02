import { Container, Grid } from '@mui/material';

import { Page, Stat } from '@indocal/ui';
import { useSuppliersCount } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => {
  const {
    loading: suppliersCountLoading,
    validating: suppliersCountValidating,
    count: suppliersCount,
  } = useSuppliersCount();

  return (
    <Page title="Dashboard" transition="down">
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          <Grid item>
            <Stat
              title="Suplidores"
              description="Suplidores registrados"
              value={suppliersCount ?? 'N/A'}
              loading={suppliersCountLoading}
              validating={suppliersCountValidating}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
