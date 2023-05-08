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
import { useConfirm } from 'material-ui-confirm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useSuppliersDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    name: zod
      .string({
        description: 'Nombre del suplidor',
        required_error: 'Debe ingresar el nombre del suplidor',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre del suplidor')
      .trim(),

    description: zod
      .string({
        description: 'Descripción del suplidor',
        required_error: 'Debe ingresar la descripción del suplidor',
        invalid_type_error: 'Formato no válido',
      })
      .trim()
      .optional(),
  },
  {
    description: 'Datos del suplidor',
    required_error: 'Debe ingresar los datos del suplidor',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddSupplierDialog: React.FC = () => {
  const router = useRouter();

  const { isAddSupplierDialogOpen, toggleAddSupplierDialog } =
    useSuppliersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { supplier, error } = await indocal.warehouse.suppliers.create({
        name: formData.name,
        ...(formData.description && { description: formData.description }),
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
        await router.push(`${Pages.SUPPLIERS}/${supplier?.id}`);

        enqueueSnackbar('Suplidor agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddSupplierDialog,
        });
      }
    },
    [router, toggleAddSupplierDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddSupplierDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddSupplierDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddSupplierDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddSupplierDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar suplidor</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Nombre"
            disabled={isSubmitting}
            inputProps={register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <TextField
            multiline
            autoComplete="off"
            label="Descripción"
            disabled={isSubmitting}
            inputProps={register('description')}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
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

export default AddSupplierDialog;
