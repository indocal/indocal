import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useSupplier, UUID } from '@indocal/services';

import { SupplierCard, SupplierOrdersDataGrid } from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const SupplierPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, supplier, error } = useSupplier(
    router.query.supplier_id as UUID
  );

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : supplier
          ? `Suplidor: ${supplier.name}`
          : 'Suplidor no encontrado'
      }
    >
      <Container
        fixed
        sx={{
          display: 'grid',
          placeContent: 'start',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : supplier ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplierCard supplier={supplier} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={8}>
              <Widget>
                <SupplierOrdersDataGrid supplier={supplier} />
              </Widget>
            </Unstable_Grid2>
          </Unstable_Grid2>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

SupplierPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplierPage;
