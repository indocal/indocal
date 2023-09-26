import { GetServerSideProps } from 'next';
import { Container, Unstable_Grid2, Typography } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { ServiceRequestsPerMonthChart } from '@indocal/services-generator';
import { FormFieldsReportsPerCycle } from '@indocal/forms-generator';
import { UUID, Service } from '@indocal/services';

import { indocal } from '@/lib';
import { ServiceCard, ServiceRequestsDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

type ServicesPageParams = {
  service_id: UUID;
};

type ServicesPageProps = {
  service: Service;
};

const ServicePage: EnhancedNextPage<ServicesPageProps> = ({ service }) => (
  <Page transition="right" title={`Servicio: ${service.title}`}>
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
            <ServiceCard service={service} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={8}>
          <Widget>
            <ServiceRequestsDataGrid service={service} />
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

        <Unstable_Grid2 xs={12} md={12}>
          <Widget>
            <ServiceRequestsPerMonthChart service={service} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12}>
          <Widget disableDefaultSizes>
            <FormFieldsReportsPerCycle
              form={service.form.id}
              client={indocal}
            />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

ServicePage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  ServicesPageProps,
  ServicesPageParams
> = async (ctx) => {
  const { service } = await indocal.services.findOneByUUID(
    ctx.params?.service_id as UUID
  );

  if (!service || service.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
    },
  };
};

export default ServicePage;
