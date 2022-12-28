import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { LogsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const LogsPage: EnhancedNextPage = () => (
  <Page title="Registros" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <LogsDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

LogsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default LogsPage;
