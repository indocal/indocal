import { useRouter } from 'next/router';
import { Container, Grid, Divider } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useFolder, UUID } from '@indocal/services';

import {
  FolderTreeBreadcrumbs,
  FolderFoldersGallery,
  FolderFilesGallery,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const UploadsByFolderPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, folder, error } = useFolder(router.query.folder_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : folder
          ? `Carpeta: ${folder.name}`
          : 'Carpeta no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : folder ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              <FolderTreeBreadcrumbs folder={folder} />
            </Grid>

            <Grid item xs={12}>
              <Divider flexItem />
            </Grid>

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <FolderFoldersGallery folder={folder} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Divider flexItem />
            </Grid>

            <Grid item xs={12}>
              <Widget disableDefaultSizes>
                <FolderFilesGallery folder={folder} />
              </Widget>
            </Grid>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

UploadsByFolderPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export default UploadsByFolderPage;
