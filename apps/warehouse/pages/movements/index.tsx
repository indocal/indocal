import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { InventoryMovementsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const InventoryMovementsPage: EnhancedNextPage = () => (
  <Page title="Movimientos" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <InventoryMovementsDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

InventoryMovementsPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default InventoryMovementsPage;
