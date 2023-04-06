import NextLink from 'next/link';
import { Container, Unstable_Grid2, Alert, Button } from '@mui/material';
import { Launch as ViewDetailsIcon } from '@mui/icons-material';

import { Page, Widget } from '@indocal/ui';
import { Can } from '@indocal/services';

import { UsersDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

const UsersPage: EnhancedNextPage = () => (
  <Page title="Usuarios" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        placeContent: 'start',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2 container spacing={1}>
        <Unstable_Grid2 xs={12}>
          <Can I="update" an="userRole">
            <Alert
              severity="info"
              action={
                <Button
                  LinkComponent={NextLink}
                  href={Pages.USERS_ROLES}
                  size="small"
                  color="info"
                  endIcon={<ViewDetailsIcon />}
                >
                  Administrar
                </Button>
              }
            >
              Roles / Permisos
            </Alert>
          </Can>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Can I="update" an="userGroup">
            <Alert
              severity="info"
              action={
                <Button
                  LinkComponent={NextLink}
                  href={Pages.USERS_GROUPS}
                  size="small"
                  color="info"
                  endIcon={<ViewDetailsIcon />}
                >
                  Administrar
                </Button>
              }
            >
              Grupos
            </Alert>
          </Can>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Widget height={500}>
            <UsersDataGrid />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

UsersPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersPage;
