import { useCallback } from 'react';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { useAppAbility, ServiceRequest } from '@indocal/services';

import { indocal } from '@/lib';
import { GenericServicesRequestsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type ServicesRequestsPageProps = {
  requests: ServiceRequest[];
};

const ServicesRequestsPage: EnhancedNextPage<ServicesRequestsPageProps> = ({
  requests,
}) => {
  const ability = useAppAbility();

  const canCreate = ability.can('create', 'serviceRequest');

  const handleAdd = useCallback(() => {
    window.open(Pages.SERVICES, '_blank');
  }, []);

  return (
    <Page title="Historial de solicitudes" transition="down">
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
          <Unstable_Grid2 xs={12}>
            <Widget sx={{ height: 500 }}>
              <GenericServicesRequestsDataGrid
                title={`Solicitudes realizadas (${requests.length})`}
                requests={requests}
                onAddButtonClick={canCreate && handleAdd}
              />
            </Widget>
          </Unstable_Grid2>
        </Unstable_Grid2>
      </Container>
    </Page>
  );
};

ServicesRequestsPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export const getServerSideProps: GetServerSideProps<
  ServicesRequestsPageProps
> = async (ctx) => {
  const token = await getToken(ctx);

  if (!token) {
    const url = new URL(ctx.resolvedUrl, process.env.NEXT_PUBLIC_SITE_URL);

    return {
      redirect: {
        destination: `${Pages.SIGN_IN}?callbackUrl=${url.toString()}`,
        permanent: false,
      },
    };
  }

  const { requests, error } = await indocal.services.requests.findMany({
    filters: { requestedBy: { id: token.user.id } },
    orderBy: { createdAt: 'desc' },
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      requests,
    },
  };
};

export default ServicesRequestsPage;
