import { useState, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page, Widget } from '@indocal/ui';
import {
  FormGenerator,
  FormGeneratorAnswers,
  serializeFormGeneratorAnswers,
} from '@indocal/forms-generator';
import {
  getShortUUID,
  createServiceError,
  UUID,
  Form,
} from '@indocal/services';

import { indocal } from '@/lib';
import { EnhancedNextPage } from '@/types';

type FormPageParams = {
  form_id: UUID;
};

type FormPageProps = {
  form: Form;
};

const FormPage: EnhancedNextPage<FormPageProps> = ({ form }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      try {
        if (!form) return;

        const data = await serializeFormGeneratorAnswers(answers, indocal);

        const { error } = await indocal.forms.entries.create({
          answers: data,
          form: form.id,
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
            onEntered: () => setShowThankYouMessage(true),
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
    [form, enqueueSnackbar]
  );

  return (
    <Page title={`Formulario: ${getShortUUID(form.id)}`}>
      <Container
        fixed
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        <Widget disableDefaultSizes>
          <FormGenerator
            form={form}
            showThankYouMessage={showThankYouMessage}
            onSubmit={handleOnSubmit}
          />
        </Widget>
      </Container>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<
  FormPageProps,
  FormPageParams
> = async (ctx) => {
  const { form } = await indocal.forms.findOneByUUID(
    ctx.params?.form_id as UUID
  );

  if (!form || form.status !== 'PUBLISHED' || form.visibility !== 'PUBLIC') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      form,
    },
  };
};

export default FormPage;
