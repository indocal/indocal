import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';

import { Page, Widget, Loader, NotFound, ErrorInfo } from '@indocal/ui';
import { useOrder, UUID } from '@indocal/services';

import {
  OrderCard,
  OrderItemsDetails,
  OrderItemsTable,
  SupplierCard,
} from '@/features';
import { AdminDashboard } from '@/components';
import { EnhancedNextPage } from '@/types';

const OrderPage: EnhancedNextPage = () => {
  const router = useRouter();

  const { loading, order, error } = useOrder(router.query.order_id as UUID);

  return (
    <Page
      transition="right"
      title={
        loading
          ? 'Cargando...'
          : order
          ? `Orden: ${order.code}`
          : 'Orden no encontrada'
      }
    >
      <Container fixed sx={{ paddingY: (theme) => theme.spacing(2) }}>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : order ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={12} md={4}>
              <Widget>
                <OrderCard order={order} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <SupplierCard supplier={order.supplier.id} />
              </Widget>
            </Grid>

            <Grid item xs={12} md={4}>
              <Widget>
                <OrderItemsDetails order={order} />
              </Widget>
            </Grid>

            <Grid item xs={12}>
              <Widget>
                <OrderItemsTable order={order} />
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

OrderPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default OrderPage;
