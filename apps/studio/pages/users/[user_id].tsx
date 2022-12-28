import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUser, UUID } from '@indocal/services';

import {
  UserCard,
  UserRolesList,
  UserGroupsList,
  LogsDataGrid,
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
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : user ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <UserCard user={user} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <UserRolesList user={user} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <UserGroupsList user={user} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget height={500}>
                <LogsDataGrid user={user} />
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

UserPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UserPage;
