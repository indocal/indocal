import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import {
  FormGenerator,
  serializeFormGeneratorAnswers,
  FormGeneratorAnswers,
} from '@indocal/forms-generator';
import { useForm, createServiceError, UUID } from '@indocal/services';

import { indocal } from '@/lib';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const FormPreviewPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const { loading, form, error } = useForm(router.query.form_id as UUID);

  const { enqueueSnackbar } = useSnackbar();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      try {
        if (!form) return;

        const data = await serializeFormGeneratorAnswers(answers, indocal);

        const { error } = await indocal.forms.entries.create({
          answers: data,
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
            onEntered: () => setIsSubmitSuccessful(true),
          });
        }
      } catch (exeption) {
        const error = createServiceError(exeption);

        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
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
          <FormGenerator
            form={form}
            showThankYouMessage={isSubmitSuccessful}
            onSubmit={handleOnSubmit}
            onReset={() => setIsSubmitSuccessful(false)}
          />
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

FormPreviewPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default FormPreviewPage;
