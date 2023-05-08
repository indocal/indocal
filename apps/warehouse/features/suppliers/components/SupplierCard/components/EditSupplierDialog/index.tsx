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
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Supplier, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useSupplierCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      name: zod
        .string({
          description: 'Nombre del suplidor',
          required_error: 'Debe ingresar el nombre del suplidor',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del suplidor')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del suplidor',
          required_error: 'Debe ingresar la descripción del suplidor',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),
    },
    {
      description: 'Datos del suplidor',
      required_error: 'Debe ingresar los datos del suplidor',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditSupplierDialogProps {
  supplier: Supplier;
}

export const EditSupplierDialog: React.FC<EditSupplierDialogProps> = ({
  supplier,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditSupplierDialogOpen, toggleEditSupplierDialog } =
    useSupplierCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: supplier.name,
      description: supplier.description,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { supplier: updated, error } =
        await indocal.warehouse.suppliers.update(supplier.id, {
          name: formData.name,
          description: formData.description || null,
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
        await mutate(`${ApiEndpoints.SUPPLIERS}/${supplier.id}`, updated);

        enqueueSnackbar('Suplidor editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditSupplierDialog,
        });
      }
    },
    [supplier.id, mutate, toggleEditSupplierDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditSupplierDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditSupplierDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditSupplierDialog, confirm]);

  return (
    <Dialog fullWidth open={isEditSupplierDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar suplidor</DialogTitle>

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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditSupplierDialog;
