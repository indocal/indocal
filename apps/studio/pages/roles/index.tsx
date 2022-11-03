import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { UsersRolesDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UsersRolesPage: EnhancedNextPage = () => (
  <Page title="Roles" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <UsersRolesDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

UsersRolesPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersRolesPage;
