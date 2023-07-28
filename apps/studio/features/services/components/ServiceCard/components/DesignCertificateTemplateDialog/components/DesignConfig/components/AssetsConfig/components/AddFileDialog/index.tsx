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
import { useFormContext, Control } from 'react-hook-form';

import { ControlledFilesDropzone } from '@indocal/ui';
import { ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { DesignCertificateTemplateDialogData } from '../../../../../../context';

import { useAssetsConfig } from '../../context';

export const AddFileDialog: React.FC = () => {
  const { mutate } = useSWRConfig();

  const { service, isAddFileDialogOpen, toggleAddFileDialog } =
    useAssetsConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const onSubmit = useCallback(
    async (formData: DesignCertificateTemplateDialogData) => {
      if (!service.template) return;

      const { error } = await indocal.services.templates.upsert(service.id, {
        layout: formData.layout,
        content: formData.content,
        styles: formData.styles,
        assets: formData.assets,
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

        enqueueSnackbar('Recursos cargados exitosamente', {
          variant: 'success',
          onEntered: toggleAddFileDialog,
        });
      }
    },
    [service, mutate, toggleAddFileDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddFileDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddFileDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddFileDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddFileDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar recursos</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledFilesDropzone
            required
            multiple
            name="assets"
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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFileDialog;
