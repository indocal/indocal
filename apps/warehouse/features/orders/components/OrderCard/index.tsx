import NextLink from 'next/link';
import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Launch as ViewDetailsIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  Can,
  useOrder,
  getShortUUID,
  translateOrderStatus,
  UUID,
  Order,
} from '@indocal/services';

import { Pages } from '@/config';

import { OrderCardProvider, useOrderCard } from './context';
import { EditOrderDialog } from './components';

export interface OrderCardProps {
  order: UUID | Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order: entity }) => {
  const { loading, validating, order, error } = useOrder(
    typeof entity === 'string' ? entity : entity.id
  );

  const { isEditOrderDialogOpen, toggleEditOrderDialog } = useOrderCard();

  return (
    <Card
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      {loading ? (
        <Loader invisible message="Cargando datos de la orden..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : order ? (
        <>
          {isEditOrderDialogOpen && <EditOrderDialog order={order} />}

          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles de la orden"
            action={
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Can I="read" an="order">
                  <IconButton
                    LinkComponent={NextLink}
                    href={`${Pages.ORDERS}/${order.id}`}
                    size="small"
                    sx={{ display: 'flex' }}
                  >
                    <ViewDetailsIcon />
                  </IconButton>
                </Can>

                <Can I="update" an="order">
                  <IconButton size="small" onClick={toggleEditOrderDialog}>
                    <EditIcon />
                  </IconButton>
                </Can>
              </Stack>
            }
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />

          <CardContent
            sx={{
              position: 'relative',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemText primary="ID" secondary={getShortUUID(order.id)} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText primary="Código" secondary={order.code} />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Estado"
                  secondary={translateOrderStatus(order.status)}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Suplidor"
                  secondary={order.supplier.name}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Fecha de creación"
                  secondary={new Date(order.createdAt).toLocaleDateString()}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemText
                  primary="Última modificación"
                  secondary={new Date(order.updatedAt).toLocaleDateString()}
                />
              </ListItem>
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado datos de la orden" />
      )}
    </Card>
  );
};

const OrderCardWrapper: React.FC<OrderCardProps> = (props) => (
  <OrderCardProvider>
    <OrderCard {...props} />
  </OrderCardProvider>
);

export { OrderCardWrapper as OrderCard };

export default OrderCardWrapper;
