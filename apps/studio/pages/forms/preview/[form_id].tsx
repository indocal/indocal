import { useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';
import { useSnackbar } from 'notistack';

import { Page } from '@indocal/ui';
import { FormGenerator, FormGeneratorAnswers } from '@indocal/forms-generator';
import {
  INDOCAL,
  UUID,
  Form,
  FormFieldAnswer,
  FilesFormFieldConfig,
  UsersFormFieldConfig,
  User,
} from '@indocal/services';

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

  const parseFilesFormFieldAnswer = useCallback(
    async (answer: FormGeneratorAnswers[number]): Promise<FormFieldAnswer> => {
      const config = answer.field.config as FilesFormFieldConfig | null;
      const content = answer.content as File[] | null;

      if (config?.multiple && content) {
        const { files } = await indocal.uploads.files.upload(content);

        return {
          field: answer.field,
          content: files.map((file) => file.id),
        };
      }

      if (content) {
        const { files } = await indocal.uploads.files.upload(content);

        return {
          field: answer.field,
          content: files.length > 0 ? files[0].id : null,
        };
      }

      return {
        field: answer.field,
        content: null,
      };
    },
    []
  );

  const parseUsersFormFieldAnswer = useCallback(
    (answer: FormGeneratorAnswers[number]): FormFieldAnswer => {
      const config = answer.field.config as UsersFormFieldConfig | null;
      const content = answer.content as User | User[] | null;

      if (config?.multiple && Array.isArray(content)) {
        return {
          field: answer.field,
          content: content.map((user) => user.id),
        };
      }

      if (content && !Array.isArray(content)) {
        return {
          field: answer.field,
          content: content.id,
        };
      }

      return {
        field: answer.field,
        content: null,
      };
    },
    []
  );

  const handleOnSubmit = useCallback(
    async (answers: FormGeneratorAnswers) => {
      const promises = answers.map(async (answer) => {
        if (answer.field.type === 'FILES') {
          return await parseFilesFormFieldAnswer(answer);
        }

        if (answer.field.type === 'USERS') {
          return parseUsersFormFieldAnswer(answer);
        }

        // TODO: Handle other types of fields (e.g. SECTIONS, TABLES)

        return answer;
      });

      const data = (await Promise.all(promises)) as FormFieldAnswer[];

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
    [
      form,
      session?.user.id,
      enqueueSnackbar,
      parseFilesFormFieldAnswer,
      parseUsersFormFieldAnswer,
    ]
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
