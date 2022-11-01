import { useCallback } from 'react';
import { useRouter } from 'next/router';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useUsersGroupsDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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
      .optional(),
  },
  {
    description: 'Datos del grupo',
    required_error: 'Debe ingresar los datos del grupo',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddUserGroupDialog: React.FC = () => {
  const router = useRouter();

  const { isAddUserGroupDialogOpen, toggleAddUserGroupDialog } =
    useUsersGroupsDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { group, error } = await indocal.auth.groups.create({
        name: formData.name,
        description: formData.description,
      });

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
        await router.push(`${Pages.USERS_GROUPS}/${group?.id}`);

        enqueueSnackbar('Grupo agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddUserGroupDialog,
        });
      }
    },
    [router, toggleAddUserGroupDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddUserGroupDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleAddUserGroupDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleAddUserGroupDialog]);

  return (
    <Dialog fullWidth open={isAddUserGroupDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar grupo</DialogTitle>

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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserGroupDialog;
