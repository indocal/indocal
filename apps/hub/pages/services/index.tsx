import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, NotFound } from '@indocal/ui';
import { Service } from '@indocal/services';

import { indocal } from '@/lib';
import { ServicesGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type ServicesPageProps = {
  services: Service[];
};

const ServicesPage: EnhancedNextPage<ServicesPageProps> = ({ services }) => (
  <Page title="Servicios" transition="down">
    <Container
      fixed
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        paddingY: (theme) => theme.spacing(2),
      }}
    >
      {services.length > 0 ? (
        <Unstable_Grid2
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ height: 'fit-content' }}
        >
          <Unstable_Grid2 xs={12}>
            <Widget disableDefaultSizes>
              <ServicesGallery services={services} />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      ) : (
        <NotFound
          caption="Servicios no encontrados"
          description="No existe o no posee acceso a ningún servicios"
        />
      )}
    </Container>
  </Page>
);

ServicesPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<ServicesPageProps> = async (
  ctx
) => {
  const [token, { services }] = await Promise.all([
    getToken(ctx),
    indocal.services.findMany({ filters: { status: 'PUBLISHED' } }),
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
      services: services.filter((service) => {
        if (service.form.visibility === 'PUBLIC') return true;

        if (service.form.visibility === 'PROTECTED' && token) return true;

        return (
          service.form.visibility === 'PRIVATE' &&
          user?.groups.some((group) => group.id === service.group.id)
        );
      }),
    },
  };
};

export default ServicesPage;
