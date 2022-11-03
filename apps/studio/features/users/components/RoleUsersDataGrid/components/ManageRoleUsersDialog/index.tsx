import { useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { UserRole, UserStatus, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';
import { ControlledUsersAutocomplete } from '@/features';

import { useRoleUsersDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    users: zod
      .object(
        {
          id: zod.string().uuid(),
          username: zod.string(),
          email: zod.string().email(),
          status: zod.enum<string, [UserStatus, ...UserStatus[]]>([
            'ENABLED',
            'DISABLED',
          ]),
          createdAt: zod.string(),
          updatedAt: zod.string(),
        },
        {
          description: 'Miembros que pertenecen al rol',
          required_error: 'Debe seleccionar al menos un miembro',
          invalid_type_error: 'Formato no válido',
        }
      )
      .array(),
  },
  {
    description: 'Miembros que pertenecen al rol',
    required_error: 'Debe seleccionar al menos un miembro',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageRoleUsersDialogProps {
  role: UserRole;
}

export const ManageRoleUsersDialog: React.FC<ManageRoleUsersDialogProps> = ({
  role,
}) => {
  const { mutate } = useSWRConfig();

  const { isManageRoleUsersDialogOpen, toggleManageRoleUsersDialog } =
    useRoleUsersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      users: role.users,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { role: updated, error } = await indocal.auth.roles.update(
        role.id,
        {
          users: formData.users.map((user) => user.id),
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

        enqueueSnackbar('Miembros actualizados exitosamente', {
          variant: 'success',
          onEntered: toggleManageRoleUsersDialog,
        });
      }
    },
    [role.id, mutate, toggleManageRoleUsersDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageRoleUsersDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleManageRoleUsersDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleManageRoleUsersDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageRoleUsersDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Miembros</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledUsersAutocomplete
            required
            multiple
            name="users"
            label="Usuarios"
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
          Actualizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ManageRoleUsersDialog;
