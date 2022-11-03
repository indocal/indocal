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

import { User, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';
import { ControlledUsersRolesAutocomplete } from '@/features';

import { useUserRolesList } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
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
      .array(),
  },
  {
    description: 'Roles asignados al usuario',
    required_error: 'Debe seleccionar al menos un rol',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageUserRolesDialogProps {
  user: User;
}

export const ManageUserRolesDialog: React.FC<ManageUserRolesDialogProps> = ({
  user,
}) => {
  const { mutate } = useSWRConfig();

  const { isManageUserRolesDialogOpen, toggleManageUserRolesDialog } =
    useUserRolesList();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      roles: user.roles,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { user: updated, error } = await indocal.auth.users.update(
        user.id,
        {
          roles: formData.roles.map((role) => role.id),
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

        enqueueSnackbar('Roles actualizados exitosamente', {
          variant: 'success',
          onEntered: toggleManageUserRolesDialog,
        });
      }
    },
    [user.id, mutate, toggleManageUserRolesDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageUserRolesDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleManageUserRolesDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleManageUserRolesDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageUserRolesDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Roles</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledUsersRolesAutocomplete
            required
            multiple
            name="roles"
            label="Roles"
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

export default ManageUserRolesDialog;
