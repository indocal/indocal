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

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import { UserGroup, UserStatus, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useGroupUsersDataGrid } from '../../context';

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
          description: 'Miembros que pertenecen al grupo',
          required_error: 'Debe seleccionar al menos un miembro',
          invalid_type_error: 'Formato no válido',
        }
      )
      .array(),
  },
  {
    description: 'Miembros que pertenecen al grupo',
    required_error: 'Debe seleccionar al menos un miembro',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageGroupUsersDialogProps {
  group: UserGroup;
}

export const ManageGroupUsersDialog: React.FC<ManageGroupUsersDialogProps> = ({
  group,
}) => {
  const { mutate } = useSWRConfig();

  const { isManageGroupUsersDialogOpen, toggleManageGroupUsersDialog } =
    useGroupUsersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      users: group.members,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { group: updated, error } = await indocal.auth.groups.update(
        group.id,
        { members: formData.users.map((member) => member.id) }
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
        await mutate(`${ApiEndpoints.USERS_GROUPS}/${group.id}`, updated);

        enqueueSnackbar('Miembros actualizados exitosamente', {
          variant: 'success',
          onEntered: toggleManageGroupUsersDialog,
        });
      }
    },
    [group.id, mutate, toggleManageGroupUsersDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageGroupUsersDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleManageGroupUsersDialog();
      reset();
    }
  }, [isDirty, reset, toggleManageGroupUsersDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageGroupUsersDialogOpen}
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

export default ManageGroupUsersDialog;
