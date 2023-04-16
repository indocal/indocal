import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Stat } from '@indocal/ui';
import {
  useUsersCount,
  useUsersRolesCount,
  useUsersGroupsCount,
  useFormsCount,
  useServicesCount,
  useFilesCount,
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

  const {
    loading: servicesCountLoading,
    validating: servicesCountValidating,
    count: servicesCount,
  } = useServicesCount();

  const {
    loading: filesCountLoading,
    validating: filesCountValidating,
    count: filesCount,
  } = useFilesCount();

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
          <Unstable_Grid2>
            <Stat
              title="Usuarios"
              description="Usuarios registrados"
              value={usersCount ?? 'N/A'}
              loading={usersCountLoading}
              validating={usersCountValidating}
            />
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Stat
              title="Roles"
              description="Roles definidos"
              value={rolesCount ?? 'N/A'}
              loading={rolesCountLoading}
              validating={rolesCountValidating}
            />
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Stat
              title="Grupos"
              description="Grupos definidos"
              value={groupsCount ?? 'N/A'}
              loading={groupsCountLoading}
              validating={groupsCountValidating}
            />
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Stat
              title="Formularios"
              description="Formularios digitalizados"
              value={formsCount ?? 'N/A'}
              loading={formsCountLoading}
              validating={formsCountValidating}
            />
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Stat
              title="Servicios"
              description="Servicios disponibles"
              value={servicesCount ?? 'N/A'}
              loading={servicesCountLoading}
              validating={servicesCountValidating}
            />
          </Unstable_Grid2>

          <Unstable_Grid2>
            <Stat
              title="Archivos"
              description="Archivos cargados"
              value={filesCount ?? 'N/A'}
              loading={filesCountLoading}
              validating={filesCountValidating}
            />
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Container>
    </Page>
  );
};

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default DashboardPage;
