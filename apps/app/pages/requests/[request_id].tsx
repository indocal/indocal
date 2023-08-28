import { GetServerSideProps } from 'next';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { ServiceRequestTimeline } from '@indocal/services-generator';
import { getShortUUID, UUID, ServiceRequest } from '@indocal/services';

import { indocal } from '@/lib';
import {
  ServiceCard,
  ServiceRequestComments,
  ServicesCertificatesList,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type ServiceRequestPageParams = {
  request_id: UUID;
};

type ServiceRequestPageProps = {
  request: ServiceRequest;
};

const ServiceRequestPage: EnhancedNextPage<ServiceRequestPageProps> = ({
  request,
}) => (
  <Page transition="right" title={`Solicitud: ${getShortUUID(request.id)}`}>
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
            <ServiceCard service={request.service} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={8}>
          <Widget>
            <ServiceRequestTimeline request={request} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={7}>
          <Widget sx={{ height: 300 }}>
            <ServiceRequestComments request={request} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={5}>
          <Widget sx={{ height: 300 }}>
            <ServicesCertificatesList certificates={request.certificates} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

ServiceRequestPage.getLayout = (page) => (
  <AdminDashboard>{page}</AdminDashboard>
);

export const getServerSideProps: GetServerSideProps<
  ServiceRequestPageProps,
  ServiceRequestPageParams
> = async (ctx) => {
  const { request } = await indocal.services.requests.findOneByUUID(
    ctx.params?.request_id as UUID
  );

  if (!request) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      request: {
        ...request,
        comments: request.comments.filter((comment) => !comment.isInternal),
      },
    },
  };
};

export default ServiceRequestPage;
