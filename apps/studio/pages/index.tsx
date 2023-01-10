import { Container, Grid } from '@mui/material';

import { Page, Stat } from '@indocal/ui';
import {
  useUsersCount,
  useUsersRolesCount,
  useUsersGroupsCount,
  useFormsCount,
} from '@indocal/services';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const DashboardPage: EnhancedNextPage = () => {
  const {
    loading: usersCountLoading,
    validating: usersCountValidating,
    count: usersCount,
  } = useUsersCount();

  const {
    loading: rolesCountLoading,
    validating: rolesCountValidating,
    count: rolesCount,
  } = useUsersRolesCount();

  const {
    loading: groupsCountLoading,
    validating: groupsCountValidating,
    count: groupsCount,
  } = useUsersGroupsCount();

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
              title="Roles"
              description="Roles definidos"
              value={rolesCount ?? 'N/A'}
              loading={rolesCountLoading}
              validating={rolesCountValidating}
            />
          </Grid>

          <Grid item>
            <Stat
              title="Grupos"
              description="Grupos definidos"
              value={groupsCount ?? 'N/A'}
              loading={groupsCountLoading}
              validating={groupsCountValidating}
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
