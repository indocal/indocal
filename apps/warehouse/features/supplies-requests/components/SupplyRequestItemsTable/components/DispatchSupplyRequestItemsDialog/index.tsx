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
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';

import { NoData } from '@indocal/ui';
import { SupplyRequest, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useSupplyRequestItemsTable } from '../../context';

type FormData = {
  received: number[];
};

export interface DispatchSupplyRequestItemsDialogProps {
  request: SupplyRequest;
}

export const DispatchSupplyRequestItemsDialog: React.FC<
  DispatchSupplyRequestItemsDialogProps
> = ({ request }) => {
  const { mutate } = useSWRConfig();

  const {
    isDispatchSupplyRequestItemsDialogOpen,
    toggleDispatchSupplyRequestItemsDialog,
  } = useSupplyRequestItemsTable();

  const { enqueueSnackbar } = useSnackbar();

  const calcRemaining = useCallback(
    (item: SupplyRequest['items'][number]) =>
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
      received: request.items.map((item) => calcRemaining(item)),
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.warehouse.requests.dispatchItems({
        request: request.id,
        received: request.items.map((item, index) => ({
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
        await mutate(`${ApiEndpoints.SUPPLIES_REQUESTS}/${request.id}`);
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.startsWith(ApiEndpoints.INVENTORY_MOVEMENTS) &&
            key.includes(typeof request === 'string' ? request : request.id)
        );

        enqueueSnackbar('Artículos despachados exitosamente', {
          variant: 'success',
          onEntered: toggleDispatchSupplyRequestItemsDialog,
        });
      }
    },
    [request, mutate, toggleDispatchSupplyRequestItemsDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleDispatchSupplyRequestItemsDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleDispatchSupplyRequestItemsDialog();
      reset();
    }
  }, [isDirty, reset, toggleDispatchSupplyRequestItemsDialog]);

  return (
    <Dialog
      fullWidth
      open={isDispatchSupplyRequestItemsDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Despachar artículos</DialogTitle>

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
                      brequestLeft: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    Cantidad despachada
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {request.items.length > 0 ? (
                  request.items.map((item, index) => (
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
                          brequestLeft: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <TextField
                          size="small"
                          type="number"
                          autoComplete="off"
                          placeholder="#"
                          disabled={
                            isSubmitting ||
                            item.deliveryStatus === 'COMPLETED' ||
                            ['COMPLETED', 'CANCELLED'].includes(request.status)
                          }
                          inputProps={register(`received.${index}`, {
                            valueAsNumber: true,
                            required: {
                              value: true,
                              message: 'Debe ingresar la cantidad despachada',
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
                      <NoData message="Esta solicitud no contiene artículos" />
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
          disabled={['COMPLETED', 'CANCELLED'].includes(request.status)}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Actualizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DispatchSupplyRequestItemsDialog;
