import { useMemo, useCallback, createElement } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import { Loader, NoData, ErrorInfo } from '@indocal/ui';
import { useService, ServiceRequest, ApiEndpoints } from '@indocal/services';

import { ServiceCertificateData } from '@indocal/services';

import { indocal } from '@/lib';

import { useCertificatesDataGrid } from '../../context';

import { GenerateCertificateDialogProvider } from './context';
import {
  TextPlaceholderField,
  SignaturePlaceholderField,
  SectionPlaceholderField,
  TablePlaceholderField,
  AutocompletePopover,
} from './components';

export interface GenerateCertificateDialogProps {
  request: ServiceRequest;
  defaultValues?: ServiceCertificateData;
}

const GenerateCertificateDialog: React.FC<GenerateCertificateDialogProps> = ({
  request,
}) => {
  const { mutate } = useSWRConfig();

  const { loading, service, error } = useService(request.service.id);

  const { isGenerateCertificateDialogOpen, toggleGenerateCertificateDialog, toggleAddCertificateDialog } =
  useCertificatesDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    setValue,
    handleSubmit,
    reset,
  } = useFormContext();

  const fields = useMemo(
    () => ({
      TEXT: TextPlaceholderField,
      SIGNATURE: SignaturePlaceholderField,
      SECTION: SectionPlaceholderField,
      TABLE: TablePlaceholderField,
    }),
    []
  );

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
        await mutate(
          (key) =>
            typeof key === 'string' &&
            key.includes(ApiEndpoints.SERVICES_CERTIFICATES)
        ),

        enqueueSnackbar('Certificado generado exitosamente', {
          variant: 'success',
          onEntered: () => {
            toggleGenerateCertificateDialog()
            toggleAddCertificateDialog()
          },
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

  const handleImportData = useCallback(() => {
    try {
      const input = document.createElement('input');

      input.type = 'file';
      input.accept = '.json';

      input.addEventListener('change', (e) => {
        const event = e as unknown as React.ChangeEvent<HTMLInputElement>;

        const file = event.target.files && event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
          if (!event.target?.result) return;

          Object.entries(JSON.parse(event.target.result as string)).forEach(
            ([key, value]) => {
              setValue(key, value, { shouldDirty: true });
            }
          );
        };

        reader.readAsText(file);
      });

      input.click();
    } catch {
      enqueueSnackbar('Error al importar datos', { variant: 'error' });
    }
  }, [setValue, enqueueSnackbar]);

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
    <>
      <AutocompletePopover request={request} />

      <Dialog
        fullWidth
        maxWidth="md"
        open={isGenerateCertificateDialogOpen}
        onClose={handleOnClose}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Generar certificado</Typography>

          <Button
            variant="contained"
            endIcon={<UploadFileIcon />}
            disabled={!service?.template?.placeholders?.length || isSubmitting}
            onClick={handleImportData}
          >
            Importar datos
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Loader invisible message="Cargando datos..." />
          ) : error ? (
            <ErrorInfo error={error} />
          ) : service?.template && service.template.placeholders.length > 0 ? (
            <Stack component="form" autoComplete="off" spacing={2}>
              {service.template.placeholders.map((placeholder, index) =>
                createElement(fields[placeholder.type], {
                  key: `${index}-${placeholder.name}`,
                  placeholder,
                })
              )}
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
    </>
  );
};

const GenerateCertificateDialogWrapper: React.FC<
  GenerateCertificateDialogProps
> = ({ request, defaultValues }) => (
  <GenerateCertificateDialogProvider defaultValues={defaultValues}>
    <GenerateCertificateDialog
      request={request}
      defaultValues={defaultValues}
    />
  </GenerateCertificateDialogProvider>
);

export { GenerateCertificateDialogWrapper as GenerateCertificateDialog };

export default GenerateCertificateDialogWrapper;
