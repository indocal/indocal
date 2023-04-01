import { Container, Grid } from '@mui/material';

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
      sx={{ display: 'flex', paddingY: (theme) => theme.spacing(2) }}
    >
      {forms.length > 0 ? (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Widget disableDefaultSizes>
              <FormsGallery forms={forms} />
            </Widget>
          </Grid>
        </Grid>
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
