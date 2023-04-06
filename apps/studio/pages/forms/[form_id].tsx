import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

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
        ) : form ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <FormCard form={form} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <FormFieldsCard form={form} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <UserGroupCard group={form.group.id} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget>
                <FormEntriesDataGrid form={form} />
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

FormPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormPage;
