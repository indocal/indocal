import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUser, UUID } from '@indocal/services';

import {
  UserCard,
  UserRolesList,
  UserGroupsList,
  UserLogsDataGrid,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UserPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, user, error } = useUser(router.query.user_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : user
          ? `Usuario: ${user.username}`
          : 'Usuario no encontrado'
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
        ) : user ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserCard user={user} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserRolesList user={user} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserGroupsList user={user} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget height={500}>
                <UserLogsDataGrid user={user} />
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

UserPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UserPage;
