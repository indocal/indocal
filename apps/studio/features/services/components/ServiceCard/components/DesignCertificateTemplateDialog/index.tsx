import { useCallback } from 'react';
import {
  Stack,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import { Service, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceCard } from '../../context';

import {
  DesignCertificateTemplateDialogProvider,
  DesignCertificateTemplateDialogData,
} from './context';
import { CertificatePreview, DesignConfig } from './components';

export interface DesignCertificateTemplateDialogProps {
  service: Service;
}

const DesignCertificateTemplateDialog: React.FC<
  DesignCertificateTemplateDialogProps
> = ({ service }) => {
  const { mutate } = useSWRConfig();

  const {
    isDesignCertificateTemplateDialogOpen,
    toggleDesignCertificateTemplateDialog,
  } = useServiceCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    getValues,
    reset,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const handleSave = useCallback(async () => {
    const values = getValues();

    const { error } = await indocal.services.templates.upsert(service.id, {
      layout: values.layout,
      content: values.content,
      styles: values.styles,
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

      enqueueSnackbar('Plantilla editada exitosamente', { variant: 'success' });
    }
  }, [service.id, getValues, mutate, enqueueSnackbar]);

  const handleOnClose = useCallback(() => {
    if (isSubmitting) return;

    if (!isDirty) {
      toggleDesignCertificateTemplateDialog();
    } else {
      confirm({
        title: 'Terminar edición',
        description: '¿Estás seguro? Los cambios no guardados se perderan.',
      })
        .then(() => {
          toggleDesignCertificateTemplateDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [
    isDirty,
    isSubmitting,
    reset,
    toggleDesignCertificateTemplateDialog,
    confirm,
  ]);

  return (
    <Dialog
      fullScreen
      open={isDesignCertificateTemplateDialogOpen}
      onClose={handleOnClose}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Diseñar certificado</Typography>

          <LoadingButton
            variant="contained"
            size="small"
            loading={isSubmitting}
            disabled={!isDirty}
            endIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Guardar cambios
          </LoadingButton>
        </Toolbar>
      </AppBar>

      <DialogContent dividers sx={{ padding: (theme) => theme.spacing(1) }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          divider={
            <Divider
              flexItem
              orientation="vertical"
              sx={{ borderBottom: (th) => `1px solid ${th.palette.divider}` }}
            />
          }
          sx={{ height: '100%' }}
        >
          <Stack
            sx={{
              flex: { xs: 1, md: 4 },
              paddingX: (theme) => theme.spacing(0.5),
            }}
          >
            <CertificatePreview service={service} />
          </Stack>

          <Stack
            sx={{
              flex: { xs: 1, md: 3 },
              paddingX: (theme) => theme.spacing(0.5),
              overflow: 'auto',
            }}
          >
            <DesignConfig service={service} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={handleOnClose}
        >
          Finalizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const DesignCertificateTemplateDialogWrapper: React.FC<
  DesignCertificateTemplateDialogProps
> = ({ service }) => (
  <DesignCertificateTemplateDialogProvider service={service}>
    <DesignCertificateTemplateDialog service={service} />
  </DesignCertificateTemplateDialogProvider>
);

export { DesignCertificateTemplateDialogWrapper as DesignCertificateTemplateDialog };

export default DesignCertificateTemplateDialogWrapper;
