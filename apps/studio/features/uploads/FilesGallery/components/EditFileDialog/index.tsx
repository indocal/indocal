import { useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Unstable_Grid2,
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
import { Can, File, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFilesGallery } from '../../context';

import { FileDetails, FileViewer } from './components';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      name: zod
        .string({
          description: 'Nombre del archivo',
          required_error: 'Debe ingresar el nombre del archivo',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre del archivo')
        .trim(),

      alt: zod
        .string({
          description: 'Texto alternativo del archivo',
          required_error: 'Debe ingresar el texto alternativo del archivo',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

      caption: zod
        .string({
          description: 'Título del archivo',
          required_error: 'Debe ingresar el título del archivo',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

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
      description: 'Datos del archivo',
      required_error: 'Debe ingresar los datos del archivo',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFileDialogProps {
  file: File;
}

export const EditFileDialog: React.FC<EditFileDialogProps> = ({ file }) => {
  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { isEditFileDialogOpen, toggleEditFileDialog } = useFilesGallery();

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
      name: file.name,
      alt: file.alt,
      caption: file.caption,
      folder: file.folder,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.uploads.files.update(file.id, {
        name: formData.name,
        alt: formData.alt,
        caption: formData.caption,
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
              key.startsWith(ApiEndpoints.FILES) &&
              key.includes(folder)
            : typeof key === 'string' && key.startsWith(ApiEndpoints.FILES)
        );

        enqueueSnackbar('Archivo editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFileDialog,
        });
      }
    },
    [
      file.id,
      router.query.folder_id,
      mutate,
      toggleEditFileDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditFileDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditFileDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditFileDialog]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isEditFileDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Editar archivo</DialogTitle>

      <DialogContent dividers>
        <Unstable_Grid2 container spacing={1}>
          <Unstable_Grid2 xs={12}>
            <FileDetails file={file} />
          </Unstable_Grid2>

          <Unstable_Grid2 xs={12} md={6} sx={{ height: 250 }}>
            <FileViewer file={file} />
          </Unstable_Grid2>

          <Unstable_Grid2
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 250,
            }}
          >
            <Stack
              component="form"
              autoComplete="off"
              spacing={2}
              sx={{ width: '100%' }}
            >
              <TextField
                required
                autoComplete="off"
                size="small"
                label="Nombre"
                disabled={isSubmitting}
                inputProps={register('name')}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />

              <TextField
                autoComplete="off"
                size="small"
                label="Texto Alternativo"
                disabled={isSubmitting}
                inputProps={register('alt')}
                error={Boolean(errors.alt)}
                helperText={errors.alt?.message}
              />

              <TextField
                autoComplete="off"
                size="small"
                label="Título"
                disabled={isSubmitting}
                inputProps={register('caption')}
                error={Boolean(errors.caption)}
                helperText={errors.caption?.message}
              />

              <Can I="read" a="folder">
                <ControlledFoldersAutocomplete
                  required
                  name="folder"
                  label="Carpeta"
                  control={control}
                  disabled={isSubmitting}
                  autocompleteProps={{
                    getOptionDisabled: (option) =>
                      option.id === file.folder?.id,
                  }}
                  textFieldProps={{ size: 'small' }}
                />
              </Can>
            </Stack>
          </Unstable_Grid2>
        </Unstable_Grid2>
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

export default EditFileDialog;
