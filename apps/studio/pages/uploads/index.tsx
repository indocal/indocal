import { Container, Grid } from '@mui/material';

import { Page } from '@indocal/ui';

import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UploadsPage: EnhancedNextPage = () => (
  <Page title="Librería de archivos" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container justifyContent="center" alignItems="center" spacing={1}>
        <Grid item xs={12}></Grid>
      </Grid>
    </Container>
  </Page>
);

UploadsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UploadsPage;
