import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { UsersGroupsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UsersGroupsPage: EnhancedNextPage = () => (
  <Page title="Grupos" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <UsersGroupsDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

UsersGroupsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UsersGroupsPage;
