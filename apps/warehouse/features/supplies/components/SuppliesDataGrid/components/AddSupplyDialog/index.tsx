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

import { SupplyUnit } from '@indocal/services';

import { indocal } from '@/lib';
import { ControlledSupplyUnitSelect } from '@/features';
import { Pages } from '@/config';

import { useSuppliesDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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
      .min(1, 'Debe ingresar el nombre del recurso')
      .trim(),

    description: zod
      .string({
        description: 'Descripción del recurso',
        required_error: 'Debe ingresar la descripción del recurso',
        invalid_type_error: 'Formato no válido',
      })
      .trim()
      .optional(),

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

    quantity: zod
      .nan({
        description: 'Cantidad inicial del recurso',
        required_error: 'Debe ingresar la cantidad inicial del recurso',
        invalid_type_error: 'Formato no válido',
      })
      .or(
        zod
          .number({
            description: 'Cantidad inicial del recurso',
            required_error: 'Debe ingresar la cantidad inicial del recurso',
            invalid_type_error: 'Formato no válido',
          })
          .nonnegative('Debe ingresar una cantidad válida')
      ),
  },
  {
    description: 'Datos del recurso',
    required_error: 'Debe ingresar los datos del recurso',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddSupplyDialog: React.FC = () => {
  const router = useRouter();

  const { isAddSupplyDialogOpen, toggleAddSupplyDialog } =
    useSuppliesDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      unit: 'UNIT',
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { supply, error } = await indocal.warehouse.supplies.create({
        code: formData.code,
        name: formData.name,
        unit: formData.unit,
        ...(formData.quantity && { quantity: formData.quantity }),
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
        await router.push(`${Pages.SUPPLIES}/${supply?.id}`);

        enqueueSnackbar('Recurso agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddSupplyDialog,
        });
      }
    },
    [router, toggleAddSupplyDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddSupplyDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddSupplyDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddSupplyDialog]);

  return (
    <Dialog fullWidth open={isAddSupplyDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar recurso</DialogTitle>

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

          <TextField
            type="number"
            autoComplete="off"
            label="Cantidad inicial"
            disabled={isSubmitting}
            inputProps={register('quantity', { valueAsNumber: true })}
            error={Boolean(errors.quantity)}
            helperText={
              errors.quantity
                ? errors.quantity.message
                : 'NOTA: No se podrá ajustar la cantidad de manera manual en el futuro con el fin de asegurar la integridad de los datos en el sistema. De necesitar un ajuste, contacte al soporte.'
            }
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

export default AddSupplyDialog;
