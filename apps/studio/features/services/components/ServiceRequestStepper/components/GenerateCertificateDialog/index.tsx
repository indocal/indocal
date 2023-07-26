import { useCallback } from 'react';
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
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useService, ServiceRequest, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceRequestStepper } from '../../context';

export interface GenerateCertificateDialogProps {
  request: ServiceRequest;
}

export const GenerateCertificateDialog: React.FC<
  GenerateCertificateDialogProps
> = ({ request }) => {
  const { mutate } = useSWRConfig();

  const { loading, service, error } = useService(request.service.id);

  const { isGenerateCertificateDialogOpen, toggleGenerateCertificateDialog } =
    useServiceRequestStepper();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = useCallback(
    async (formData: Record<string, string>) => {
      if (!service?.template) return;

      const { error } = await indocal.services.certificates.create({
        data: formData,
        template: service.template.id,
        request: request.id,
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
        await mutate(`${ApiEndpoints.SERVICES_REQUESTS}/${request.id}`);

        enqueueSnackbar('Certificado generado exitosamente', {
          variant: 'success',
          onEntered: toggleGenerateCertificateDialog,
        });
      }
    },
    [
      request.id,
      service?.template,
      toggleGenerateCertificateDialog,
      mutate,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleGenerateCertificateDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleGenerateCertificateDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleGenerateCertificateDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isGenerateCertificateDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Generar certificado</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={error} />
        ) : service?.template && service.template.placeholders.length > 0 ? (
          <Stack component="form" autoComplete="off" spacing={2}>
            {service.template.placeholders.map((placeholder) => (
              <TextField
                key={placeholder.name}
                required
                autoComplete="off"
                label={placeholder.title}
                disabled={isSubmitting}
                inputProps={register(placeholder.name, {
                  required: 'Debe completar este campo',
                })}
                error={Boolean(errors[placeholder.name])}
                helperText={errors[placeholder.name]?.message as string}
              />
            ))}
          </Stack>
        ) : (
          <NoData message="Placeholders aún sin definir" />
        )}
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
          Generar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateCertificateDialog;
