import { Container, Grid, Divider } from '@mui/material';

import { Page } from '@indocal/ui';
import { useFolders, useFiles } from '@indocal/services';

import { FoldersGallery, FilesGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UploadsPage: EnhancedNextPage = () => {
  const { folders } = useFolders();
  const { files } = useFiles();

  return (
    <Page title="Librería de archivos" transition="down">
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <FoldersGallery
              title={`Carpetas (${folders.length})`}
              folders={folders}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider flexItem />
          </Grid>

          <Grid item xs={12}>
            <FilesGallery title={`Archivos (${files.length})`} files={files} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

UploadsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default UploadsPage;
