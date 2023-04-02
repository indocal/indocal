import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { SuppliesRequestsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SuppliesRequestsPage: EnhancedNextPage = () => (
  <Page title="Solicitudes" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <SuppliesRequestsDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

SuppliesRequestsPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default SuppliesRequestsPage;
