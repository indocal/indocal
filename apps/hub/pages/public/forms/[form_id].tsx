import { useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page, BasicLayout } from '@indocal/ui';
import {
  FormGenerator,
  serializeFormGeneratorAnswers,
  FormGeneratorAnswers,
} from '@indocal/forms-generator';
import { INDOCAL, UUID, Form } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';
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

FormPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export const getServerSideProps: GetServerSideProps<
  FormPageProps,
  FormPageParams
> = async (ctx) => {
  const token = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    token: process.env.INDOCAL_API_KEY,
  });

  const { form } = await indocal.forms.findOneByUUID(
    ctx.params?.form_id as string
  );

  if (!form || form.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  if (form.visibility === 'PUBLIC') {
    return {
      props: {
        form,
      },
    };
  }

  if (form.visibility === 'PROTECTED') {
    if (token) {
      return {
        props: {
          form,
        },
      };
    }
  }

  if (form.visibility === 'PRIVATE') {
    if (token) {
      const { user } = await indocal.auth.users.findOneByUUID(token.user.id);

      const isMember = user?.groups
        .map((group) => group.id)
        .includes(form.group.id);

      if (isMember) {
        return {
          props: {
            form,
          },
        };
      } else {
        return {
          notFound: true,
        };
      }
    }
  }

  const destination = new URL(Pages.SIGN_IN, process.env.NEXT_PUBLIC_SITE_URL);

  const callbackUrl = new URL(
    ctx.resolvedUrl,
    process.env.NEXT_PUBLIC_SITE_URL
  );

  destination.searchParams.append('callbackUrl', callbackUrl.toString());

  return {
    redirect: {
      destination: destination.toString(),
      permanent: false,
    },
  };
};

export default FormPage;
