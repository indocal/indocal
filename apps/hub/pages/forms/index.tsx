import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Paper, Container, Grid } from '@mui/material';

import { Page, Widget, NoData } from '@indocal/ui';
import { INDOCAL, UUID, Form } from '@indocal/services';

import { FormsGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type FormsPageProps = {
  forms: Form[];
};

const FormsPage: EnhancedNextPage<FormsPageProps> = ({ forms }) => (
  <Page title="Formularios" transition="down">
    <Container
      fixed
      sx={{ display: 'flex', paddingY: (theme) => theme.spacing(2) }}
    >
      {forms.length > 0 ? (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Widget disableDefaultSizes>
              <FormsGallery forms={forms} />
            </Widget>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ margin: 'auto', padding: (theme) => theme.spacing(4) }}>
          <NoData message="No existe o no posee acceso a ningún formulario" />
        </Paper>
      )}
    </Container>
  </Page>
);

FormsPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<FormsPageProps> = async (
  ctx
) => {
  const token = await getToken(ctx);

  const indocal = new INDOCAL({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    token: token?.access_token,
  });

  const { user: me } = await indocal.auth.users.findOneByUUID(
    token?.user.id as UUID
  );

  const { forms, error } = await indocal.forms.findMany({
    filters: { status: 'PUBLISHED' },
  });

  const availableForms = forms.filter((form) => {
    switch (form.visibility) {
      case 'PUBLIC': {
        return true;
      }

      case 'PROTECTED': {
        return me ? true : false;
      }

      case 'PRIVATE': {
        return me?.groups.some((group) => group.id === form.group.id);
      }

      default: {
        return false;
      }
    }
  });

  if (error) throw error;

  return {
    props: {
      forms: availableForms,
    },
  };
};

export default FormsPage;
