import { useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page } from '@indocal/ui';
import { FormGenerator } from '@indocal/forms-generator';
import { INDOCAL, UUID, Form, FormFieldAnswer } from '@indocal/services';

import { indocal } from '@/lib';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type FormPageParams = {
  form_id: UUID;
};

type FormPageProps = {
  form: Form;
};

const FormPage: EnhancedNextPage<FormPageProps> = ({ form }) => {
  const { data: session } = useSession();

  const { enqueueSnackbar } = useSnackbar();

  const handleOnSubmit = useCallback(
    async (answers: FormFieldAnswer[]) => {
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
    <Page transition="right" title={`Formulario: ${form.title}`}>
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <FormGenerator form={form} onSubmit={handleOnSubmit} />
      </Container>
    </Page>
  );
};

FormPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  FormPageProps,
  FormPageParams
> = async (ctx) => {
  const token = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    token: token?.access_token,
  });

  const { user: me } = await indocal.auth.users.findOneByUUID(
    token?.user.id as UUID
  );

  const { form } = await indocal.forms.findOneByUUID(
    ctx.params?.form_id as string
  );

  if (!form || form.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  if (form.visibility === 'PROTECTED' && !me) {
    return {
      notFound: true,
    };
  }

  if (
    form.visibility === 'PRIVATE' &&
    !me?.groups.some((group) => group.id === form.group.id)
  ) {
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
