import { useState, useCallback } from 'react';
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
import { createServiceError, UUID, Form } from '@indocal/services';

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

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      try {
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
    <Page transition="right" title={`Formulario: ${form.title}`}>
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        <FormGenerator
          form={form}
          showThankYouMessage={isSubmitSuccessful}
          onSubmit={handleOnSubmit}
          onReset={() => setIsSubmitSuccessful(false)}
        />
      </Container>
    </Page>
  );
};

FormPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export const getServerSideProps: GetServerSideProps<
  FormPageProps,
  FormPageParams
> = async (ctx) => {
  const [token, { form }] = await Promise.all([
    getToken(ctx),
    indocal.forms.findOneByUUID(ctx.params?.form_id as string),
  ]);

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

  if (form.visibility === 'PROTECTED' && token) {
    return {
      props: {
        form,
      },
    };
  }

  if (form.visibility === 'PRIVATE' && token) {
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
