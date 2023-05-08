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

import { ControlledApiTokenStatusSelect } from '@indocal/forms-generator';
import { ApiToken, ApiTokenStatus, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useApiTokenCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
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

      status: zod
        .enum<string, [ApiTokenStatus, ...ApiTokenStatus[]]>(
          ['ENABLED', 'DISABLED'],
          {
            description: 'Estado del API Token',
            required_error: 'Debe seleccionar el estado del API Token',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Estado del API Token'),
    },
    {
      description: 'Datos del API Token',
      required_error: 'Debe ingresar los datos del API Token',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditApiTokenDialogProps {
  apiToken: ApiToken;
}

export const EditApiTokenDialog: React.FC<EditApiTokenDialogProps> = ({
  apiToken,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditApiTokenDialogOpen, toggleEditApiTokenDialog } =
    useApiTokenCard();

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
      name: apiToken.name,
      description: apiToken.description,
      status: apiToken.status,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { apiToken: updated, error } = await indocal.auth.apiTokens.update(
        apiToken.id,
        {
          name: formData.name,
          description: formData.description,
          status: formData.status,
        }
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
        await mutate(`${ApiEndpoints.API_TOKENS}/${apiToken.id}`, updated);

        enqueueSnackbar('API Token editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditApiTokenDialog,
        });
      }
    },
    [apiToken.id, mutate, toggleEditApiTokenDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditApiTokenDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditApiTokenDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditApiTokenDialog, confirm]);

  return (
    <Dialog fullWidth open={isEditApiTokenDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar API Token</DialogTitle>

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

          <ControlledApiTokenStatusSelect
            required
            name="status"
            label="Estado"
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

export default EditApiTokenDialog;
