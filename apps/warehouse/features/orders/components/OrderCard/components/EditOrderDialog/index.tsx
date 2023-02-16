import { useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Order, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useOrderCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      code: zod
        .string({
          description: 'Código de la orden',
          required_error: 'Debe ingresar el código de la orden',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el código de la orden')
        .trim(),

      concept: zod
        .string({
          description: 'Concepto de la orden',
          required_error: 'Debe ingresar el concepto de la orden',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el concepto de la orden')
        .trim(),
    },
    {
      description: 'Datos de la orden',
      required_error: 'Debe ingresar los datos de la orden',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditOrderDialogProps {
  order: Order;
}

export const EditOrderDialog: React.FC<EditOrderDialogProps> = ({ order }) => {
  const { mutate } = useSWRConfig();

  const { isEditOrderDialogOpen, toggleEditOrderDialog } = useOrderCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: order.code,
      concept: order.concept,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { order: updated, error } = await indocal.warehouse.orders.update(
        order.id,
        { code: formData.code, concept: formData.concept }
      );

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
        await mutate(`${ApiEndpoints.ORDERS}/${order.id}`, updated);

        enqueueSnackbar('Orden editada exitosamente', {
          variant: 'success',
          onEntered: toggleEditOrderDialog,
        });
      }
    },
    [order.id, mutate, toggleEditOrderDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditOrderDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditOrderDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditOrderDialog]);

  return (
    <Dialog fullWidth open={isEditOrderDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar orden</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Código"
            disabled={isSubmitting}
            inputProps={register('code')}
            error={Boolean(errors.code)}
            helperText={errors.code?.message}
          />

          <TextField
            required
            multiline
            autoComplete="off"
            label="Concepto"
            disabled={isSubmitting}
            inputProps={register('concept')}
            error={Boolean(errors.concept)}
            helperText={errors.concept?.message}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditOrderDialog;
