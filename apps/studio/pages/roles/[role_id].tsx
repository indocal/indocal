import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUserRole, UUID } from '@indocal/services';

import {
  UserRoleCard,
  RoleUsersDataGrid,
  UserRolePermissionsManagementPanel,
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
      <Container
        fixed
        sx={{
          display: 'grid',
          placeContent: 'start',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : role ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserRoleCard role={role} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={8}>
              <Widget>
                <RoleUsersDataGrid role={role} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <UserRolePermissionsManagementPanel role={role} />
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

UserRolePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UserRolePage;
