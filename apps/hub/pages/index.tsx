import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { ServiceRequest, ServiceCertificate } from '@indocal/services';

import { indocal } from '@/lib';
import {
  GenericServicesRequestsDataGrid,
  ServicesCertificatesList,
} from '@/features';
import { AdminDashboard } from '@/components';
import { Pages } from '@/config';
import { EnhancedNextPage } from '@/types';

type DashboardPageProps = {
  pendingRequests: ServiceRequest[];
  certificates: ServiceCertificate[];
};

const DashboardPage: EnhancedNextPage<DashboardPageProps> = ({
  pendingRequests,
  certificates,
}) => (
  <Page title="Resumen" transition="down">
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
        <Unstable_Grid2 xs={12} md={8}>
          <Widget>
            <GenericServicesRequestsDataGrid
              title={`Solicitudes pendientes (${pendingRequests.length})`}
              requests={pendingRequests}
              enhancedDataGridProps={{ density: 'compact' }}
            />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={4}>
          <Widget>
            <ServicesCertificatesList certificates={certificates} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

DashboardPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  DashboardPageProps
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

  const promises = await Promise.all([
    indocal.services.requests.findMany({
      filters: {
        status: { notIn: ['COMPLETED', 'CANCELLED'] },
        requestedBy: { id: token.user.id },
      },
      orderBy: { createdAt: 'desc' },
    }),
    indocal.services.certificates.findMany({
      filters: { request: { requestedBy: { id: token.user.id } } },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const error = promises.some((promise) => promise.error);

  if (error) {
    return {
      notFound: true,
    };
  }

  const [{ requests: pendingRequests }, { certificates }] = promises;

  return {
    props: {
      pendingRequests,
      certificates,
    },
  };
};

export default DashboardPage;
