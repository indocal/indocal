import { useRouter } from 'next/router';
import { Container } from '@mui/material';

import { useForm, UUID } from '@indocal/services';
import { Page, Loader, NotFound, ErrorInfo } from '@indocal/ui';

import { FormGenerator } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormPreviewPage: EnhancedNextPage = () => {
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
          <FormGenerator form={form} />
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

FormPreviewPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormPreviewPage;
