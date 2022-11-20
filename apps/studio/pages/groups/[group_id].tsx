import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useUserGroup, UUID } from '@indocal/services';

import {
  UserGroupCard,
  GroupUsersDataGrid,
  GroupFormsDataGrid,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UserGroupPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, group, error } = useUserGroup(router.query.group_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : group
          ? `Grupo: ${group.name}`
          : 'Grupo no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : group ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <UserGroupCard group={group} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <GroupUsersDataGrid group={group} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget>
                <GroupFormsDataGrid group={group} />
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

UserGroupPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UserGroupPage;
