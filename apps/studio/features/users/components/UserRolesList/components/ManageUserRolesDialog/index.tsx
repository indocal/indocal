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

import { ControlledUsersRolesAutocomplete } from '@indocal/forms-generator';
import { User, ApiEndpoints } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useUserRolesList } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    roles: entitySchema({
      description: 'Roles asignados al usuario',
      required_error: 'Debe seleccionar al menos un rol',
      invalid_type_error: 'Formato no válido',
    }).array(),
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

  const confirm = useConfirm();

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
        { roles: formData.roles.map((role) => role.id) }
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

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleManageUserRolesDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleManageUserRolesDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleManageUserRolesDialog, confirm]);

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
