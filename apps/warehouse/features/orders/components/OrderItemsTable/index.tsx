import { useMemo } from 'react';
import {
  Paper,
  Toolbar,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  ChipProps,
} from '@mui/material';
import { Archive as ArchiveIcon } from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import {
  Can,
  translateOrderStatus,
  Order,
  OrderStatus,
} from '@indocal/services';

import { OrderItemsTableProvider, useOrderItemsTable } from './context';
import { OrderItemDetails, ReceiveOrderItemsDialog } from './components';

export interface OrderItemsTableProps {
  order: Order;
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ order }) => {
  const { isReceiveOrderItemsDialogOpen, toggleReceiveOrderItemsDialog } =
    useOrderItemsTable();

  const statusColors: Record<OrderStatus, ChipProps['color']> = useMemo(
    () => ({
      PENDING: 'error',
      PARTIAL: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
    }),
    []
  );

  return (
    <>
      {isReceiveOrderItemsDialogOpen && (
        <ReceiveOrderItemsDialog order={order} />
      )}

      <Paper
        sx={{
          display: 'grid',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
            paddingY: (theme) => theme.spacing(2),
          }}
        >
          <Chip
            label={`Estado -> ${translateOrderStatus(order.status)}`}
            color={statusColors[order.status]}
          />

          <Can I="update" an="orderItem">
            <Button
              size="small"
              variant="contained"
              disabled={['COMPLETED', 'CANCELLED'].includes(order.status)}
              endIcon={<ArchiveIcon />}
              onClick={toggleReceiveOrderItemsDialog}
            >
              Recibir artículos
            </Button>
          </Can>
        </Toolbar>

        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Recurso</TableCell>
                <TableCell align="center">Cantidad solicitada</TableCell>
                <TableCell align="center">Cantidad recibida</TableCell>
                <TableCell align="center">Precio unitario</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {order.items.length > 0 ? (
                order.items.map((item) => (
                  <OrderItemDetails key={item.id} order={order} item={item} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <NoData message="Esta orden no contiene artículos" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

const OrderItemsTableWrapper: React.FC<OrderItemsTableProps> = (props) => (
  <OrderItemsTableProvider>
    <OrderItemsTable {...props} />
  </OrderItemsTableProvider>
);

export { OrderItemsTableWrapper as OrderItemsTable };

export default OrderItemsTableWrapper;
