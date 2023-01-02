import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { SuppliesDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SuppliesPage: EnhancedNextPage = () => (
  <Page title="Inventario" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <SuppliesDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

SuppliesPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SuppliesPage;
