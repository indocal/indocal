import { useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';

import { NoData, NumberField } from '@indocal/ui';
import { Order, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useOrderItemsTable } from '../../context';

type FormData = {
  received: number[];
};

export interface ReceiveOrderItemsDialogProps {
  order: Order;
}

export const ReceiveOrderItemsDialog: React.FC<
  ReceiveOrderItemsDialogProps
> = ({ order }) => {
  const { mutate } = useSWRConfig();

  const { isReceiveOrderItemsDialogOpen, toggleReceiveOrderItemsDialog } =
    useOrderItemsTable();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const calcRemaining = useCallback(
    (item: Order['items'][number]) =>
      item.quantity -
      item.received.reduce((total, current) => total + current, 0),
    []
  );

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      received: order.items.map((item) => calcRemaining(item)),
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.warehouse.orders.receiveItems({
        order: order.id,
        received: order.items.map((item, index) => ({
          item: item.id,
          quantity: formData.received[index]
            ? Math.trunc(formData.received[index])
            : 0,
        })),
      });

      if (error) {
        enqueueSnackbar(
          error.details
            ? error.details.reduce(
                (acc, current) => (acc ? `${acc} | ${current}` : current),
                ``
              )
            : error.message,
          { variant: 'error' }
        );
      } else {
        await mutate(`${ApiEndpoints.ORDERS}/${order.id}`);

        enqueueSnackbar('Artículos recibidos exitosamente', {
          variant: 'success',
          onEntered: toggleReceiveOrderItemsDialog,
        });
      }
    },
    [
      order.id,
      order.items,
      mutate,
      toggleReceiveOrderItemsDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleReceiveOrderItemsDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleReceiveOrderItemsDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleReceiveOrderItemsDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isReceiveOrderItemsDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Recibir artículos</DialogTitle>

      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Recurso</TableCell>

                  <TableCell
                    align="center"
                    sx={{
                      borderLeft: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Cantidad recibida
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">
                        <Typography>{item.supply.name}</Typography>

                        <Typography
                          variant="caption"
                          fontWeight="bolder"
                          color="Highlight"
                        >
                          {`Restante: ${calcRemaining(item)}`}
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          width: 185,
                          borderLeft: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <NumberField
                          size="small"
                          autoComplete="off"
                          placeholder="#"
                          disabled={
                            isSubmitting ||
                            item.deliveryStatus === 'COMPLETED' ||
                            ['COMPLETED', 'CANCELLED'].includes(order.status)
                          }
                          inputProps={register(`received.${index}`, {
                            valueAsNumber: true,
                            required: {
                              value: true,
                              message: 'Debe ingresar la cantidad recibida',
                            },
                            min: {
                              value: 0,
                              message: 'Debe ingresar una cantidad válida',
                            },
                            max: {
                              value: calcRemaining(item),
                              message: 'Debe ingresar una cantidad válida',
                            },
                            validate: (value) =>
                              Number.isInteger(value) ||
                              'La cantidad debe ser un número entero',
                          })}
                          error={
                            errors &&
                            errors.received &&
                            Boolean(errors.received[index])
                          }
                          helperText={
                            errors.received &&
                            errors.received[index] &&
                            errors.received[index]?.message
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <NoData message="Esta orden no contiene artículos" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={['COMPLETED', 'CANCELLED'].includes(order.status)}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Actualizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReceiveOrderItemsDialog;
