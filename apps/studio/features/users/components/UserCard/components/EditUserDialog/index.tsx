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

import { User, UserStatus, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';
import {
  ControlledUserStatusSelect,
  ControlledUsersRolesAutocomplete,
  ControlledUsersGroupsAutocomplete,
} from '@/features';

import { useUserCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      username: zod
        .string({
          description: 'Usuario',
          required_error: 'Debe ingresar el usuario',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el usuario')
        .trim(),

      email: zod
        .string({
          description: 'Correo electrónico del usuario',
          required_error: 'Debe ingresar el correo electrónico del usuario',
          invalid_type_error: 'Formato no válido',
        })
        .email('Debe ingresar un correo electrónico válido')
        .trim(),

      status: zod
        .enum<string, [UserStatus, ...UserStatus[]]>(['ENABLED', 'DISABLED'], {
          description: 'Estado del usuario',
          required_error: 'Debe ingresar el estado del usuario',
          invalid_type_error: 'Formato no válido',
        })
        .describe('Estado del usuario'),

      roles: zod
        .object(
          {
            id: zod.string().uuid(),
            type: zod.string(),
            name: zod.string(),
            description: zod.string(),
            config: zod.unknown().optional(),
            createdAt: zod.string(),
            updatedAt: zod.string(),
          },
          {
            description: 'Roles asignados al usuario',
            required_error: 'Debe seleccionar al menos un rol',
            invalid_type_error: 'Formato no válido',
          }
        )
        .array()
        .min(1, 'Debe seleccionar al menos un rol'),

      groups: zod
        .object(
          {
            id: zod.string().uuid(),
            name: zod.string(),
            description: zod.string().nullable(),
            createdAt: zod.string(),
            updatedAt: zod.string(),
          },
          {
            description: 'Grupos a los que pertenece el usuario',
            required_error: 'Debe seleccionar al menos un grupo',
            invalid_type_error: 'Formato no válido',
          }
        )
        .array()
        .min(1, 'Debe seleccionar al menos un grupo'),
    },
    {
      description: 'Datos del usuario',
      required_error: 'Debe ingresar los datos del usuario',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditUserDialogProps {
  user: User;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ user }) => {
  const { mutate } = useSWRConfig();

  const { isEditUserDialogOpen, toggleEditUserDialog } = useUserCard();

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
      username: user.username,
      email: user.email,
      status: user.status,
      roles: user.roles,
      groups: user.groups,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const response = window.confirm(
        '¿Estás seguro que quieres guardar los cambios? Si hace esto tendrá que volver a iniciar sesión'
      );

      if (response) {
        const { user: updated, error } = await indocal.auth.users.update(
          user.id,
          {
            username: formData.username,
            email: formData.email,
            status: formData.status,

            ...(formData.roles && {
              roles: formData.roles.map((role) => role.id),
            }),

            ...(formData.groups && {
              groups: formData.groups.map((group) => group.id),
            }),
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
          await mutate(`${ApiEndpoints.USERS}/${user.id}`, updated);

          enqueueSnackbar('Usuario editado exitosamente', {
            variant: 'success',
            onEntered: toggleEditUserDialog,
          });
        }
      }
    },
    [user.id, mutate, toggleEditUserDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditUserDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleEditUserDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleEditUserDialog]);

  return (
    <Dialog fullWidth open={isEditUserDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar usuario</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Usuario"
            disabled={isSubmitting}
            inputProps={register('username')}
            error={Boolean(errors.username)}
            helperText={errors.username?.message}
          />

          <TextField
            required
            type="email"
            autoComplete="off"
            label="Correo electrónico"
            disabled={isSubmitting}
            inputProps={register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />

          <ControlledUserStatusSelect
            required
            name="status"
            label="Estado"
            control={control}
            disabled={isSubmitting}
          />

          <ControlledUsersRolesAutocomplete
            required
            multiple
            name="roles"
            label="Roles"
            control={control}
            disabled={isSubmitting}
          />

          <ControlledUsersGroupsAutocomplete
            required
            multiple
            name="groups"
            label="Grupos"
            control={control}
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

export default EditUserDialog;
