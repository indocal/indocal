import { useCallback } from 'react';
import { useRouter } from 'next/router';
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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledSuppliersAutocomplete } from '@indocal/forms-generator';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useOrdersDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    code: zod
      .string({
        description: 'Código de la orden',
        required_error: 'Debe ingresar el código de la orden',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el código de la orden')
      .trim(),

    supplier: zod.object(
      {
        id: zod.string().uuid(),
        name: zod.string(),
        description: zod.string().nullable(),
        createdAt: zod.string(),
        updatedAt: zod.string(),
      },
      {
        description: 'Suplidor de la orden',
        required_error: 'Debe seleccionar el suplidor',
        invalid_type_error: 'Formato no válido',
      }
    ),
  },
  {
    description: 'Datos de la orden',
    required_error: 'Debe ingresar los datos de la orden',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddOrderDialog: React.FC = () => {
  const router = useRouter();

  const { isAddOrderDialogOpen, toggleAddOrderDialog } = useOrdersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { order, error } = await indocal.warehouse.orders.create({
        code: formData.code,
        supplier: formData.supplier.id,
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
        await router.push(`${Pages.ORDERS}/${order?.id}`);

        enqueueSnackbar('Orden agregada exitosamente', {
          variant: 'success',
          onEntered: toggleAddOrderDialog,
        });
      }
    },
    [router, toggleAddOrderDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddOrderDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddOrderDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddOrderDialog]);

  return (
    <Dialog fullWidth open={isAddOrderDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar orden</DialogTitle>

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

          <ControlledSuppliersAutocomplete
            required
            name="supplier"
            label="Suplidor"
            control={control as unknown as Control}
            disabled={isSubmitting}
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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderDialog;
