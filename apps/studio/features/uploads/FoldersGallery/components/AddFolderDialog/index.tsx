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
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFoldersGallery } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    name: zod
      .string({
        description: 'Nombre de la carpeta',
        required_error: 'Debe ingresar el nombre de la carpeta',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre de la carpeta')
      .trim(),
  },
  {
    description: 'Datos de la carpeta',
    required_error: 'Debe ingresar los datos de la carpeta',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddFolderDialog: React.FC = () => {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { isAddFolderDialogOpen, toggleAddFolderDialog } = useFoldersGallery();

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
      const { error } = await indocal.uploads.folders.create({
        name: formData.name,
        ...(typeof router.query.folder_id === 'string' && {
          folder: router.query.folder_id,
        }),
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
        const folder =
          typeof router.query.folder_id === 'string'
            ? router.query.folder_id
            : null;

        await mutate((key) =>
          folder
            ? typeof key === 'string' &&
              key.startsWith(ApiEndpoints.FOLDERS) &&
              key.includes(folder)
            : typeof key === 'string' && key.startsWith(ApiEndpoints.FOLDERS)
        );

        enqueueSnackbar('Carpeta agregada exitosamente', {
          variant: 'success',
          onEntered: toggleAddFolderDialog,
        });
      }
    },
    [router, mutate, toggleAddFolderDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddFolderDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddFolderDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddFolderDialog]);

  return (
    <Dialog fullWidth open={isAddFolderDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar carpeta</DialogTitle>

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

export default AddFolderDialog;
