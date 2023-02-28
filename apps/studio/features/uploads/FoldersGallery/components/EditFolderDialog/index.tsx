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

import { ControlledFoldersAutocomplete } from '@indocal/forms-generator';
import { Can, Folder, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFoldersGallery } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      name: zod
        .string({
          description: 'Nombre de la carpeta',
          required_error: 'Debe ingresar el nombre de la carpeta',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre de la carpeta')
        .trim(),

      folder: zod
        .object(
          {
            id: zod.string().uuid(),
            name: zod.string(),
            createdAt: zod.string(),
            updatedAt: zod.string(),
          },
          {
            description: 'Carpeta',
            required_error: 'Debe seleccionar la carpeta',
            invalid_type_error: 'Formato no válido',
          }
        )
        .nullable(),
    },
    {
      description: 'Datos de la carpeta',
      required_error: 'Debe ingresar los datos de la carpeta',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFolderDialogProps {
  folder: Folder;
}

export const EditFolderDialog: React.FC<EditFolderDialogProps> = ({
  folder,
}) => {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { isEditFolderDialogOpen, toggleEditFolderDialog } =
    useFoldersGallery();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: folder.name,
      folder: folder.folder,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.uploads.folders.update(folder.id, {
        name: formData.name,
        folder: formData.folder ? formData.folder.id : null,
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

        enqueueSnackbar('Carpeta editada exitosamente', {
          variant: 'success',
          onEntered: toggleEditFolderDialog,
        });
      }
    },
    [
      folder.id,
      router.query.folder_id,
      mutate,
      toggleEditFolderDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditFolderDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditFolderDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditFolderDialog]);

  return (
    <Dialog fullWidth open={isEditFolderDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar carpeta</DialogTitle>

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

          <Can I="read" a="folder">
            <ControlledFoldersAutocomplete
              required
              name="folder"
              label="Carpeta"
              control={control}
              disabled={isSubmitting}
              autocompleteProps={{
                getOptionDisabled: (option) => option.id === folder.id,
              }}
            />
          </Can>
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

export default EditFolderDialog;
