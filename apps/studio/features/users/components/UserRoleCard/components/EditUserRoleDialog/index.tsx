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

import { UserRole, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useUserRoleCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      type: zod
        .string({
          description: 'Tipo del rol',
          required_error: 'Debe ingresar el tipo del rol',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el tipo del rol')
        .trim(),

      name: zod
        .string({
          description: 'Nombre del rol',
          required_error: 'Debe ingresar el nombre del rol',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre del rol')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del rol',
          required_error: 'Debe ingresar la descripción del rol',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar la descripción del rol')
        .trim(),
    },
    {
      description: 'Datos del rol',
      required_error: 'Debe ingresar los datos del rol',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditUserRoleDialogProps {
  role: UserRole;
}

export const EditUserRoleDialog: React.FC<EditUserRoleDialogProps> = ({
  role,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditUserRoleDialogOpen, toggleEditUserRoleDialog } =
    useUserRoleCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: role.type,
      name: role.name,
      description: role.description,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { role: updated, error } = await indocal.auth.roles.update(
        role.id,
        {
          type: formData.type,
          name: formData.name,
          description: formData.description,
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
        await mutate(`${ApiEndpoints.USERS_ROLES}/${role.id}`, updated);

        enqueueSnackbar('Rol editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditUserRoleDialog,
        });
      }
    },
    [role.id, mutate, toggleEditUserRoleDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditUserRoleDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleEditUserRoleDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleEditUserRoleDialog]);

  return (
    <Dialog fullWidth open={isEditUserRoleDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar rol</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Tipo"
            disabled={isSubmitting}
            inputProps={register('type')}
            error={Boolean(errors.type)}
            helperText={errors.type?.message}
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
            required
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

export default EditUserRoleDialog;
