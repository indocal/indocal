import { Container, Grid, Divider } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { LastFoldersGallery, LastFilesGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UploadsPage: EnhancedNextPage = () => (
  <Page title="Librería de archivos" transition="down">
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Widget disableDefaultSizes>
            <LastFoldersGallery />
          </Widget>
        </Grid>

        <Grid item xs={12}>
          <Divider flexItem />
        </Grid>

        <Grid item xs={12}>
          <Widget disableDefaultSizes>
            <LastFilesGallery />
          </Widget>
        </Grid>
      </Grid>
    </Container>
  </Page>
);

UploadsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UploadsPage;
