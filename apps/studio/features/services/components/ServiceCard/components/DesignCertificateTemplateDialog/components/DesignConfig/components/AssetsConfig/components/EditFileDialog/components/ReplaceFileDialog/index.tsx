import { useCallback } from 'react';
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
import { Service, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useAssetsConfig } from '../../../../context';

import { useEditFileDialog } from '../../context';

export interface ReplaceFileDialogProps {
  asset: NonNullable<Service['template']>['assets'][number];
}

export const ReplaceFileDialog: React.FC<ReplaceFileDialogProps> = ({
  asset,
}) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
    {
      asset: zod
        .instanceof(File, { message: 'Debe seleccionar el recurso a cargar' })
        .array()
        .max(1, 'Solo se permite cargar un recurso'),
    },
    {
      description: 'Recurso a cargar',
      required_error: 'Debe seleccionar el recurso a cargar',
      invalid_type_error: 'Formato no válido',
    }
  );

  const { mutate } = useSWRConfig();

  const { service, toggleEditFileDialog } = useAssetsConfig();

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
      const [upload] = formData.asset;

      const { error } = await indocal.uploads.files.replace(asset.id, upload);

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

        enqueueSnackbar('Recurso reemplazado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFileDialog,
        });
      }
    },
    [asset.id, service.id, mutate, toggleEditFileDialog, enqueueSnackbar]
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
      <DialogTitle>Reemplazar recurso</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledFilesDropzone
            required
            name="asset"
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
          Reemplazar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ReplaceFileDialog;
