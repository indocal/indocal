import { GetServerSideProps } from 'next';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget } from '@indocal/ui';
import { Service } from '@indocal/services';

import { ServicesGallery } from '@/features';
import { AdminDashboard } from '@/components';
import { indocal } from '@/lib';
import { EnhancedNextPage } from '@/types';

type ServicesPageProps = {
  services: Service[];
};

const ServicesPage: EnhancedNextPage<ServicesPageProps> = ({ services }) => (
  <Page title="Listado de servicios" transition="down">
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
          <Widget disableDefaultSizes>
            <ServicesGallery services={services} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    </Container>
  </Page>
);

ServicesPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export const getServerSideProps: GetServerSideProps<
  ServicesPageProps
> = async () => {
  const { services, error } = await indocal.services.findMany({
    filters: {
      status: 'PUBLISHED',
      form: { status: 'PUBLISHED' },
    },
  });

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      services,
    },
  };
};

export default ServicesPage;
