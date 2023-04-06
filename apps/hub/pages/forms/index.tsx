import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, NotFound } from '@indocal/ui';
import { Form } from '@indocal/services';

import { FormsGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type FormsPageProps = {
  forms: Form[];
};

const FormsPage: EnhancedNextPage<FormsPageProps> = ({ forms = [] }) => (
  <Page title="Formularios" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      {forms.length > 0 ? (
        <Unstable_Grid2
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ height: 'fit-content' }}
        >
          <Unstable_Grid2 xs={12}>
            <Widget disableDefaultSizes>
              <FormsGallery forms={forms} />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      ) : (
        <NotFound
          caption="Formularios no encontrados"
          description="No existe o no posee acceso a ningún formulario"
        />
      )}
    </Container>
  </Page>
);

FormsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormsPage;
