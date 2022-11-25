import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useForm, UUID } from '@indocal/services';
import { Page, Loader, NotFound, ErrorInfo } from '@indocal/ui';

import { indocal } from '@/lib';
import { FormGenerator } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormPreviewPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const { loading, form, error } = useForm(router.query.form_id as UUID);

  const { enqueueSnackbar } = useSnackbar();

  const handleOnSubmit = useCallback(
    async (formData: Record<string, unknown>) => {
      if (!form) return;

      const answers = form.fields.map((field) => ({
        field,
        content: formData[field.id] || null,
      }));

      const { error } = await indocal.forms.entries.create({
        answers,
        form: form.id,
        answeredBy: session?.user.id,
      });

      if (error) {
        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      } else {
        enqueueSnackbar('Respuestas guardadas exitosamente', {
          variant: 'success',
        });
      }
    },
    [form, session?.user.id, enqueueSnackbar]
  );

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
          <FormGenerator form={form} onSubmit={handleOnSubmit} />
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

FormPreviewPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormPreviewPage;
