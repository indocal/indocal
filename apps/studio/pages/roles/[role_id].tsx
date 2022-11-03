import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUserRole, UUID } from '@indocal/services';

import {
  UserRoleCard,
  RoleUsersDataGrid,
  UserRolePermissionsManagamentPanel,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UserRolePage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, role, error } = useUserRole(router.query.role_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : role
          ? `Rol: ${role.name}`
          : 'Rol no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : role ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <UserRoleCard role={role} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <RoleUsersDataGrid role={role} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <UserRolePermissionsManagamentPanel role={role} />
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

UserRolePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UserRolePage;
