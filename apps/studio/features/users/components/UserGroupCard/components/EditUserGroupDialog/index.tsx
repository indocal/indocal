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

import { UserGroup, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useUserGroupCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      name: zod
        .string({
          description: 'Nombre del grupo',
          required_error: 'Debe ingresar el nombre del grupo',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre del grupo')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del grupo',
          required_error: 'Debe ingresar la descripción del grupo',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),
    },
    {
      description: 'Datos del grupo',
      required_error: 'Debe ingresar los datos del grupo',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditUserGroupDialogProps {
  group: UserGroup;
}

export const EditUserGroupDialog: React.FC<EditUserGroupDialogProps> = ({
  group,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditUserGroupDialogOpen, toggleEditUserGroupDialog } =
    useUserGroupCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: group.name,
      description: group.description,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { group: updated, error } = await indocal.auth.groups.update(
        group.id,
        {
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
        await mutate(`${ApiEndpoints.USERS_GROUPS}/${group.id}`, updated);

        enqueueSnackbar('Grupo editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditUserGroupDialog,
        });
      }
    },
    [group.id, mutate, toggleEditUserGroupDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditUserGroupDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditUserGroupDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditUserGroupDialog]);

  return (
    <Dialog fullWidth open={isEditUserGroupDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar grupo</DialogTitle>

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

export default EditUserGroupDialog;
