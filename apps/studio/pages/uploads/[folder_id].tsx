import { useRouter } from 'next/router';
import { Container, Unstable_Grid2, Divider } from '@mui/material';

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
      <Container
        fixed
        sx={{
          display: 'grid',
          placeContent: 'start',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : folder ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Unstable_Grid2 xs={12}>
              <FolderTreeBreadcrumbs folder={folder} />
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Divider flexItem />
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <FolderFoldersGallery folder={folder} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Divider flexItem />
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <FolderFilesGallery folder={folder} />
              </Widget>
            </Unstable_Grid2>
          </Unstable_Grid2>
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
