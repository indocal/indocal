import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  ChipProps,
  LinearProgress,
} from '@mui/material';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import {
  useOrder,
  translateOrderItemDeliveryStatus,
  UUID,
  Order,
  OrderItemDeliveryStatus,
} from '@indocal/services';

export interface OrderItemsDetailsProps {
  order: UUID | Order;
}

export const OrderItemsDetails: React.FC<OrderItemsDetailsProps> = ({
  order: entity,
}) => {
  const { loading, validating, order, error } = useOrder(
    typeof entity === 'string' ? entity : entity.id
  );

  const statusColors: Record<OrderItemDeliveryStatus, ChipProps['color']> =
    useMemo(
      () => ({
        PENDING: 'error',
        PARTIAL: 'warning',
        COMPLETED: 'success',
      }),
      []
    );

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
        <Loader invisible message="Cargando detalles de los artículos..." />
      ) : error ? (
        <ErrorInfo error={error} />
      ) : order ? (
        <>
          {validating && (
            <LinearProgress
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            />
          )}

          <CardHeader
            subheader="Detalles de los artículos"
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
              {order.items.map(({ deliveryStatus, ...item }) => (
                <ListItem key={item.id} disablePadding divider>
                  <ListItemText
                    primary={`${item.supply.name} (${item.quantity})`}
                    secondary={`Costo total: ${Intl.NumberFormat('es-do', {
                      minimumFractionDigits: 2,
                    }).format(item.quantity * item.price)}`}
                  />

                  <ListItemSecondaryAction>
                    <Chip
                      size="small"
                      color={
                        order.status !== 'CANCELLED'
                          ? statusColors[deliveryStatus] ?? 'default'
                          : 'default'
                      }
                      label={
                        order.status !== 'CANCELLED'
                          ? translateOrderItemDeliveryStatus(deliveryStatus)
                          : 'Orden cancelada'
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </>
      ) : (
        <NoData message="No se han encontrado detalles de los artículos" />
      )}
    </Card>
  );
};

export default OrderItemsDetails;
