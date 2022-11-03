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

import { useUsersRolesDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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
);

export const AddUserRoleDialog: React.FC = () => {
  const router = useRouter();

  const { isAddUserRoleDialogOpen, toggleAddUserRoleDialog } =
    useUsersRolesDataGrid();

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
      const { role, error } = await indocal.auth.roles.create({
        type: formData.type,
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
        await router.push(`${Pages.USERS_ROLES}/${role?.id}`);

        enqueueSnackbar('Rol agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddUserRoleDialog,
        });
      }
    },
    [router, toggleAddUserRoleDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddUserRoleDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleAddUserRoleDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleAddUserRoleDialog]);

  return (
    <Dialog fullWidth open={isAddUserRoleDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar rol</DialogTitle>

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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserRoleDialog;
