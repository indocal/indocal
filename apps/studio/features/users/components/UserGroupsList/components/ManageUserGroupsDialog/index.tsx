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

import { ControlledUsersGroupsAutocomplete } from '@indocal/forms-generator';
import { User, ApiEndpoints } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useUserGroupsList } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    groups: entitySchema({
      description: 'Grupos a los que pertenece el usuario',
      required_error: 'Debe seleccionar al menos un grupo',
      invalid_type_error: 'Formato no válido',
    }).array(),
  },
  {
    description: 'Grupos a los que pertenece el usuario',
    required_error: 'Debe seleccionar al menos un grupo',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageUserGroupsDialogProps {
  user: User;
}

export const ManageUserGroupsDialog: React.FC<ManageUserGroupsDialogProps> = ({
  user,
}) => {
  const { mutate } = useSWRConfig();

  const { isManageUserGroupsDialogOpen, toggleManageUserGroupsDialog } =
    useUserGroupsList();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      groups: user.groups,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { user: updated, error } = await indocal.auth.users.update(
        user.id,
        { groups: formData.groups.map((group) => group.id) }
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

        enqueueSnackbar('Grupos actualizados exitosamente', {
          variant: 'success',
          onEntered: toggleManageUserGroupsDialog,
        });
      }
    },
    [user.id, mutate, toggleManageUserGroupsDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageUserGroupsDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleManageUserGroupsDialog();
      reset();
    }
  }, [isDirty, reset, toggleManageUserGroupsDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageUserGroupsDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Grupos</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledUsersGroupsAutocomplete
            required
            multiple
            name="groups"
            label="Grupos"
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

export default ManageUserGroupsDialog;
