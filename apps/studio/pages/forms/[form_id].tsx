import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useForm, UUID } from '@indocal/services';

import {
  FormCard,
  FormFieldsCard,
  UserGroupCard,
  FormEntriesDataGrid,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, form, error } = useForm(router.query.form_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : form
          ? `Formulario: ${form.title}`
          : 'Formulario no encontrado'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : form ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <FormCard form={form} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <FormFieldsCard form={form} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <UserGroupCard group={form.group.id} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget>
                <FormEntriesDataGrid form={form} />
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

FormPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormPage;
