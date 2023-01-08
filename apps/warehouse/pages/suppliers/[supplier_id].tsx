import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

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
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : supplier ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <SupplierCard supplier={supplier} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={8}>
              <Widget>
                <SupplierOrdersDataGrid supplier={supplier} />
              </Widget>
            </Grid>
          </Grid>
        ) : (
          <NotFound />
        )}
      </Container>
    </Page>
  );
};

SupplierPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default SupplierPage;
