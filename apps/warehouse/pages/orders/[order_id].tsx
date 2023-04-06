import { useRouter } from 'next/router';
import { Container, Unstable_Grid2 } from '@mui/material';

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
      <Container
        fixed
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingY: (theme) => theme.spacing(2),
        }}
      >
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : order ? (
          <Unstable_Grid2
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ height: 'fit-content' }}
          >
            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <OrderCard order={order} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <SupplierCard supplier={order.supplier.id} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={4}>
              <Widget>
                <OrderItemsDetails order={order} />
              </Widget>
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12}>
              <Widget disableDefaultSizes>
                <OrderItemsTable order={order} />
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

OrderPage.getLayout = (page) => <AdminDashboard>{page}</AdminDashboard>;

export default OrderPage;
