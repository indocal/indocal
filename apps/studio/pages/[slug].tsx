import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container } from '@mui/material';

import { Page, BasicLayout } from '@indocal/ui';
import { INDOCAL, Form } from '@indocal/services';

import { FormGenerator } from '@/features';
import { EnhancedNextPage } from '@/types';

type FormPageParams = {
  slug: string;
};

type FormPageProps = {
  form: Form;
};

const FormPage: EnhancedNextPage<FormPageProps> = ({ form }) => (
  <Page title={form.title}>
    <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
      <FormGenerator form={form} />
    </Container>
  </Page>
);

FormPage.getLayout = (page) => <BasicLayout>{page}</BasicLayout>;

export const getServerSideProps: GetServerSideProps<
  FormPageProps,
  FormPageParams
> = async (ctx) => {
  const jwt = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL as string,
    ...(jwt && { token: jwt.access_token }),
  });

  const { forms } = await indocal.forms.findMany({
    filters: { slug: ctx.params?.slug },
  });

  const form = forms.pop();

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

export default FormPage;
