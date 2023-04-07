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

import { ControlledApiTokenTypeSelect } from '@indocal/forms-generator';
import { ApiTokenType } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useApiTokensDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    name: zod
      .string({
        description: 'Nombre',
        required_error: 'Debe ingresar el nombre',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre')
      .trim(),

    description: zod
      .string({
        description: 'Descripción',
        required_error: 'Debe ingresar la descripción',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar la descripción')
      .trim(),

    type: zod
      .enum<string, [ApiTokenType, ...ApiTokenType[]]>(
        ['READ_ONLY', 'READ_WRITE'],
        {
          description: 'Tipo del API Token',
          required_error: 'Debe seleccionar el tipo del API Token',
          invalid_type_error: 'Formato no válido',
        }
      )
      .describe('Tipo del API Token'),
  },
  {
    description: 'Datos del API Token',
    required_error: 'Debe ingresar los datos del API Token',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddApiTokenDialog: React.FC = () => {
  const router = useRouter();

  const { isAddApiTokenDialogOpen, toggleAddApiTokenDialog } =
    useApiTokensDataGrid();

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
      type: 'READ_ONLY',
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { apiToken, error } = await indocal.auth.apiTokens.create({
        name: formData.name,
        description: formData.description,
        type: formData.type,
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
        await router.push(`${Pages.API_TOKENS}/${apiToken?.id}`);

        enqueueSnackbar('API Token agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddApiTokenDialog,
        });
      }
    },
    [router, toggleAddApiTokenDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddApiTokenDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddApiTokenDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddApiTokenDialog]);

  return (
    <Dialog fullWidth open={isAddApiTokenDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar API Token</DialogTitle>

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
            required
            multiline
            autoComplete="off"
            label="Descripción"
            disabled={isSubmitting}
            inputProps={register('description')}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />

          <ControlledApiTokenTypeSelect
            required
            name="type"
            label="Tipo"
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

export default AddApiTokenDialog;
