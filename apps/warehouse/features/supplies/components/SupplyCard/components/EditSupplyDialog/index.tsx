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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledSupplyUnitSelect } from '@indocal/forms-generator';
import { Supply, SupplyUnit, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useSupplyCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      code: zod
        .string({
          description: 'Código del recurso',
          required_error: 'Debe ingresar el código del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el código del recurso')
        .trim(),

      name: zod
        .string({
          description: 'Nombre del recurso',
          required_error: 'Debe ingresar el nombre del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del recurso')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del recurso',
          required_error: 'Debe ingresar la descripción del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

      unit: zod
        .enum<string, [SupplyUnit, ...SupplyUnit[]]>(
          ['UNIT', 'PACK', 'BOX', 'BLOCK', 'REAM', 'BALE', 'SACK', 'GALLON'],
          {
            description: 'Unidad del recurso',
            required_error: 'Debe seleccionar la unidad del recurso',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Unidad del recurso'),
    },
    {
      description: 'Datos del recurso',
      required_error: 'Debe ingresar los datos del recurso',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditSupplyDialogProps {
  supply: Supply;
}

export const EditSupplyDialog: React.FC<EditSupplyDialogProps> = ({
  supply,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditSupplyDialogOpen, toggleEditSupplyDialog } = useSupplyCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: supply.code,
      name: supply.name,
      description: supply.description,
      unit: supply.unit,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { supply: updated, error } =
        await indocal.warehouse.supplies.update(supply.id, {
          code: formData.code,
          name: formData.name,
          description: formData.description || null,
          unit: formData.unit,
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
        await mutate(`${ApiEndpoints.SUPPLIES}/${supply.id}`, updated);

        enqueueSnackbar('Recurso editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditSupplyDialog,
        });
      }
    },
    [supply.id, mutate, toggleEditSupplyDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditSupplyDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditSupplyDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditSupplyDialog, confirm]);

  return (
    <Dialog fullWidth open={isEditSupplyDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar recurso</DialogTitle>

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

          <ControlledSupplyUnitSelect
            required
            name="unit"
            label="Unidad"
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditSupplyDialog;
