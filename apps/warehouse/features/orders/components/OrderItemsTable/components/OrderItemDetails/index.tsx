import { useState } from 'react';
import {
  Box,
  Collapse,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
} from '@mui/material';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';

import { NoData } from '@indocal/ui';
import { Order } from '@indocal/services';

export interface OrderItemDetailsProps {
  order: Order;
  item: Order['items'][number];
}

export const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({
  order,
  item,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell align="center">
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell align="center">{item.supply.name}</TableCell>

        <TableCell align="center">{item.quantity}</TableCell>

        <TableCell align="center">
          {item.received.reduce((total, current) => total + current, 0)}
        </TableCell>

        <TableCell align="center">{item.price.toFixed(2)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={5} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ padding: (theme) => theme.spacing(2) }}>
              <Typography variant="h6" gutterBottom>
                Historial de entregas
              </Typography>

              <Table
                stickyHeader
                size="small"
                sx={{
                  borderRadius: (theme) => theme.spacing(1),
                  backgroundColor: (theme) => theme.palette.background.paper,
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha de entrega</TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      Cantidad
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {order.deliveryAt.length > 0 ? (
                    order.deliveryAt
                      .filter((_, index) => item.received[index])
                      .map((deliveryAt, index) => (
                        <TableRow key={deliveryAt}>
                          <TableCell sx={{ border: 'none' }}>
                            {new Date(deliveryAt).toLocaleString()}
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              border: 'none',
                              borderLeft: (theme) =>
                                `1px solid ${theme.palette.divider}`,
                            }}
                          >
                            {item.received[index]}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ border: 'none' }}>
                        <NoData message="Aún sin entregas" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default OrderItemDetails;
