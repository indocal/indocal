import { useCallback } from 'react';
import { useRouter } from 'next/router';
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

import { ControlledFilesDropzone } from '@indocal/ui';
import { ApiEndpoints } from '@indocal/services';

import { useFilesGallery } from '../../context';

export const AddFileDialog: React.FC = () => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
    {
      files: zod
        .instanceof(File)
        .array()
        .min(1, 'Debe seleccionar al menos un archivo'),
    },
    {
      description: 'Archivos a cargar',
      required_error: 'Debe seleccionar los archivos a cargar',
      invalid_type_error: 'Formato no válido',
    }
  );

  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { client, isAddFileDialogOpen, toggleAddFileDialog } =
    useFilesGallery();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await client.uploads.files.upload(formData.files, {
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
              key.startsWith(ApiEndpoints.FILES) &&
              key.includes(folder)
            : typeof key === 'string' && key.startsWith(ApiEndpoints.FILES)
        );

        enqueueSnackbar('Archivos agregados exitosamente', {
          variant: 'success',
          onEntered: toggleAddFileDialog,
        });
      }
    },
    [
      router.query.folder_id,
      client,
      mutate,
      toggleAddFileDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddFileDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddFileDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddFileDialog]);

  return (
    <Dialog fullWidth open={isAddFileDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar archivos</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledFilesDropzone
            required
            multiple
            name="files"
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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFileDialog;
