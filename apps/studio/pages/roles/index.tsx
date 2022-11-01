import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { UsersRolesTable } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UsersRolesPage: EnhancedNextPage = () => (
  <Page title="Roles y permisos" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget disableDefaultSizes>
            <UsersRolesTable />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

UsersRolesPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersRolesPage;
