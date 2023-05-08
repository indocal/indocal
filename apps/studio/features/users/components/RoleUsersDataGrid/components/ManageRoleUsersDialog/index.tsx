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
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import { UserRole, ApiEndpoints } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useRoleUsersDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    users: entitySchema({
      description: 'Miembros que pertenecen al rol',
      required_error: 'Debe seleccionar al menos un miembro',
      invalid_type_error: 'Formato no válido',
    }).array(),
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

  const confirm = useConfirm();

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
        { users: formData.users.map((user) => user.id) }
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
        await Promise.all([
          mutate(`${ApiEndpoints.USERS_ROLES}/${role.id}`, updated),
          mutate(
            (key) =>
              typeof key === 'string' &&
              key.startsWith(ApiEndpoints.USERS) &&
              key.includes(role.id)
          ),
        ]);

        enqueueSnackbar('Miembros actualizados exitosamente', {
          variant: 'success',
          onEntered: toggleManageRoleUsersDialog,
        });
      }
    },
    [role.id, mutate, toggleManageRoleUsersDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleManageRoleUsersDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleManageRoleUsersDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleManageRoleUsersDialog, confirm]);

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
