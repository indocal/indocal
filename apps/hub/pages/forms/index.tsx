import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, NotFound } from '@indocal/ui';
import { Form } from '@indocal/services';

import { indocal } from '@/lib';
import { FormsGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type FormsPageProps = {
  forms: Form[];
};

const FormsPage: EnhancedNextPage<FormsPageProps> = ({ forms }) => (
  <Page title="Formularios" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      {forms.length > 0 ? (
        <Unstable_Grid2
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ height: 'fit-content' }}
        >
          <Unstable_Grid2 xs={12}>
            <Widget disableDefaultSizes>
              <FormsGallery forms={forms} />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      ) : (
        <NotFound
          caption="Formularios no encontrados"
          description="No existe o no posee acceso a ningún formulario"
        />
      )}
    </Container>
  </Page>
);

FormsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<FormsPageProps> = async (
  ctx
) => {
  const [token, { forms }] = await Promise.all([
    getToken(ctx),
    indocal.forms.findMany({ filters: { status: 'PUBLISHED' } }),
  ]);

  if (!token) {
    const destination = new URL(
      Pages.SIGN_IN,
      process.env.NEXT_PUBLIC_SITE_URL
    );

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
  }

  const { user } = await indocal.auth.users.findOneByUUID(token.user.id);

  return {
    props: {
      forms: forms.filter((form) => {
        if (form.visibility === 'PUBLIC') return true;

        if (form.visibility === 'PROTECTED' && token) return true;

        return (
          form.visibility === 'PRIVATE' &&
          user?.groups.some((group) => group.id === form.group.id)
        );
      }),
    },
  };
};

export default FormsPage;
