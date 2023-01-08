import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { OrdersDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const OrdersPage: EnhancedNextPage = () => (
  <Page title="Ordenes" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <OrdersDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

OrdersPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default OrdersPage;
