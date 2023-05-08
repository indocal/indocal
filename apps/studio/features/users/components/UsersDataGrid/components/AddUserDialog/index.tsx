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
import { useConfirm } from 'material-ui-confirm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { PasswordTextField } from '@indocal/ui';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useUsersDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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

    name: zod
      .string({
        description: 'Nombre del usuario',
        required_error: 'Debe ingresar el nombre del usuario',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre del usuario')
      .trim(),

    password: zod
      .string({
        description: 'Contraseña del usuario',
        required_error: 'Debe ingresar la contraseña del usuario',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar la contraseña del usuario'),
  },
  {
    description: 'Datos del usuario',
    required_error: 'Debe ingresar los datos del usuario',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddUserDialog: React.FC = () => {
  const router = useRouter();

  const { isAddUserDialogOpen, toggleAddUserDialog } = useUsersDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

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
      const { user, error } = await indocal.auth.users.create({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password,
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
        await router.push(`${Pages.USERS}/${user?.id}`);

        enqueueSnackbar('Usuario agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddUserDialog,
        });
      }
    },
    [router, toggleAddUserDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddUserDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddUserDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddUserDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddUserDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar usuario</DialogTitle>

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

          <TextField
            required
            autoComplete="off"
            label="Nombre"
            disabled={isSubmitting}
            inputProps={register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <PasswordTextField
            required
            autoComplete="off"
            label="Contraseña"
            disabled={isSubmitting}
            inputProps={register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
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

export default AddUserDialog;
