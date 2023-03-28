import { useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page } from '@indocal/ui';
import {
  FormGenerator,
  serializeFormGeneratorAnswers,
  FormGeneratorAnswers,
} from '@indocal/forms-generator';
import { INDOCAL, UUID, Form } from '@indocal/services';

import { indocal } from '@/lib';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type FormPreviewPageParams = {
  form_id: UUID;
};

type FormPreviewPageProps = {
  form: Form;
};

const FormPreviewPage: EnhancedNextPage<FormPreviewPageProps> = ({ form }) => {
  const { data: session } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
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
        });
      }
    },
    [form, session?.user.id, enqueueSnackbar]
  );

  return (
    <Page transition="right" title={`Formulario: ${form.title}`}>
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <FormGenerator form={form} onSubmit={handleOnSubmit} />
      </Container>
    </Page>
  );
};

FormPreviewPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  FormPreviewPageProps,
  FormPreviewPageParams
> = async (ctx) => {
  const token = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    token: token?.access_token,
  });

  const { form } = await indocal.forms.findOneByUUID(
    ctx.params?.form_id as string
  );

  if (!form) {
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

export default FormPreviewPage;
