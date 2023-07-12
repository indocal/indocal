import { useCallback } from 'react';
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
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Service, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useAssetsConfig } from '../../context';

import { EditFileDialogProvider, useEditFileDialog } from './context';
import { FileDetails, FileViewer, ReplaceFileDialog } from './components';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      name: zod
        .string({
          description: 'Nombre del recurso',
          required_error: 'Debe ingresar el nombre del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el nombre del recurso')
        .trim(),

      alt: zod
        .string({
          description: 'Texto alternativo del recurso',
          required_error: 'Debe ingresar el texto alternativo del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

      caption: zod
        .string({
          description: 'Título del recurso',
          required_error: 'Debe ingresar el título del recurso',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),
    },
    {
      description: 'Datos del recurso',
      required_error: 'Debe ingresar los datos del recurso',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFileDialogProps {
  asset: NonNullable<Service['template']>['assets'][number];
}

const EditFileDialog: React.FC<EditFileDialogProps> = ({ asset }) => {
  const { mutate } = useSWRConfig();

  const { service, isEditFileDialogOpen, toggleEditFileDialog } =
    useAssetsConfig();

  const { isReplaceFileDialogOpen } = useEditFileDialog();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,

    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: asset.name,
      alt: asset.alt,
      caption: asset.caption,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.uploads.files.update(asset.id, {
        name: formData.name,
        alt: formData.alt,
        caption: formData.caption,
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
        await mutate(`${ApiEndpoints.SERVICES}/${service.id}`);

        enqueueSnackbar('Recurso editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFileDialog,
        });
      }
    },
    [asset.id, service.id, mutate, toggleEditFileDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditFileDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditFileDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditFileDialog, confirm]);

  return (
    <>
      {isReplaceFileDialogOpen && <ReplaceFileDialog asset={asset} />}

      <Dialog
        fullWidth
        maxWidth="md"
        open={isEditFileDialogOpen}
        onClose={handleOnClose}
      >
        <DialogTitle>Editar recurso</DialogTitle>

        <DialogContent dividers>
          <Unstable_Grid2 container spacing={1}>
            <Unstable_Grid2 xs={12}>
              <FileDetails asset={asset} />
            </Unstable_Grid2>

            <Unstable_Grid2 xs={12} md={6} sx={{ height: 250 }}>
              <FileViewer asset={asset} />
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
    </>
  );
};

const EditFileDialogWrapper: React.FC<EditFileDialogProps> = (props) => (
  <EditFileDialogProvider>
    <EditFileDialog {...props} />
  </EditFileDialogProvider>
);

export { EditFileDialogWrapper as EditFileDialog };

export default EditFileDialogWrapper;
