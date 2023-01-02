import { Container, Grid } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { SuppliersDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SuppliersPage: EnhancedNextPage = () => (
  <Page title="Suplidores" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Widget height={500}>
            <SuppliersDataGrid />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

SuppliersPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SuppliersPage;
