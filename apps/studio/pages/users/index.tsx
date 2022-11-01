import NextLink from 'next/link';
import { Container, Grid, Alert, Button, Link as MuiLink } from '@mui/material';
import { Launch as ViewDetailsIcon } from '@mui/icons-material';

import { Page, Widget } from '@indocal/ui';

import { UsersDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

const UsersPage: EnhancedNextPage = () => (
  <Page title="Usuarios" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Alert
            severity="info"
            action={
              <NextLink passHref href={Pages.USERS_ROLES}>
                <Button
                  LinkComponent={MuiLink}
                  size="small"
                  color="info"
                  endIcon={<ViewDetailsIcon />}
                >
                  Administrar
                </Button>
              </NextLink>
            }
          >
            Roles y permisos
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Alert
            severity="info"
            action={
              <NextLink passHref href={Pages.USERS_GROUPS}>
                <Button
                  LinkComponent={MuiLink}
                  size="small"
                  color="info"
                  endIcon={<ViewDetailsIcon />}
                >
                  Administrar
                </Button>
              </NextLink>
            }
          >
            Grupos
          </Alert>
        </Grid>

        <Grid item xs={12}>
          <Widget height={500}>
            <UsersDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

UsersPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersPage;
