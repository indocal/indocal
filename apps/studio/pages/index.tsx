import { Container, Grid } from '@mui/material';

import { Page, Stat } from '@indocal/ui';
import { useUsersCount, useFormsCount } from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => {
  const {
    loading: usersCountLoading,
    validating: usersCountValidating,
    count: usersCount,
  } = useUsersCount();

  const {
    loading: formsCountLoading,
    validating: formsCountValidating,
    count: formsCount,
  } = useFormsCount();

  return (
    <Page title="Dashboard" transition="down">
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <Grid container justifyContent="center" alignItems="center" spacing={1}>
          <Grid item>
            <Stat
              title="Usuarios"
              description="Usuarios registrados"
              value={usersCount ?? 'N/A'}
              loading={usersCountLoading}
              validating={usersCountValidating}
            />
          </Grid>

          <Grid item>
            <Stat
              title="Formularios"
              description="Formularios digitalizados"
              value={formsCount ?? 'N/A'}
              loading={formsCountLoading}
              validating={formsCountValidating}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
