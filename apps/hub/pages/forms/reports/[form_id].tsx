import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container, Unstable_Grid2, Typography } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import {
  FormEntriesPerMonthChart,
  FormFieldsReportsPerCycle,
} from '@indocal/forms-generator';
import { UUID, Form } from '@indocal/services';

import { indocal } from '@/lib';
import { FormCard } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type FormReportsPageParams = {
  form_id: UUID;
};

type FormReportsPageProps = {
  form: Form;
};

const FormReportsPage: EnhancedNextPage<FormReportsPageProps> = ({ form }) => (
  <Page transition="right" title={`Formulario: ${form.title}`}>
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ height: 'fit-content' }}
      >
        <Unstable_Grid2 xs={12} md={4}>
          <Widget>
            <FormCard form={form} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={8}>
          <Widget>
            <FormEntriesPerMonthChart form={form} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              margin: (theme) => theme.spacing(4),
              alignItems: 'center',
              '::before': {
                content: '""',
                flexGrow: 1,
                marginRight: (theme) => theme.spacing(2),
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },
              '::after': {
                content: '""',
                flexGrow: 1,
                marginLeft: (theme) => theme.spacing(2),
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            Reportes
          </Typography>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <FormFieldsReportsPerCycle form={form} client={indocal} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

FormReportsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  FormReportsPageProps,
  FormReportsPageParams
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

    const isMember = user?.groups.some((group) => group.id === form.group.id);

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

export default FormReportsPage;
