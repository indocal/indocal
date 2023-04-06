import { Container, Unstable_Grid2, Divider } from '@mui/material';

import { Page, Widget } from '@indocal/ui';

import { LastFoldersGallery, LastFilesGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UploadsPage: EnhancedNextPage = () => (
  <Page title="Librería de archivos" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ height: 'fit-content' }}
      >
        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <LastFoldersGallery />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Divider flexItem />
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <LastFilesGallery />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

UploadsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UploadsPage;
