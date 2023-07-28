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
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledFilesDropzone } from '@indocal/ui';
import { File as ApiFile, ApiEndpoints } from '@indocal/services';

import { useFilesGallery } from '../../../../context';

import { useEditFileDialog } from '../../context';

export interface ReplaceFileDialogProps {
  file: ApiFile;
}

export const ReplaceFileDialog: React.FC<ReplaceFileDialogProps> = ({
  file,
}) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
    {
      file: zod
        .instanceof(File, { message: 'Debe seleccionar el archivo a cargar' })
        .array()
        .max(1, 'Solo se permite cargar un archivo'),
    },
    {
      description: 'Archivo a cargar',
      required_error: 'Debe seleccionar el archivo a cargar',
      invalid_type_error: 'Formato no válido',
    }
  );

  const router = useRouter();

  const { mutate } = useSWRConfig();

  const { client, toggleEditFileDialog } = useFilesGallery();

  const { isReplaceFileDialogOpen, toggleReplaceFileDialog } =
    useEditFileDialog();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

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
      const [upload] = formData.file;

      const { error } = await client.uploads.files.replace(file.id, upload);

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

        enqueueSnackbar('Archivo reemplazado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFileDialog,
        });
      }
    },
    [
      router.query.folder_id,
      file.id,
      client,
      mutate,
      toggleEditFileDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleReplaceFileDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleReplaceFileDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleReplaceFileDialog, confirm]);

  return (
    <Dialog fullWidth open={isReplaceFileDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Reemplazar archivo</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledFilesDropzone
            required
            name="file"
            control={control as unknown as Control}
            disabled={isSubmitting}
            dropzoneProps={{ maxSize: 5 * 1024 * 1024 }}
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
          Reemplazar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReplaceFileDialog;
