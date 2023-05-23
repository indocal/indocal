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
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useFormContext } from 'react-hook-form';

import { Service } from '@indocal/services';

import { useServiceCard } from '../../context';

import {
  DesignCertificateTemplateDialogProvider,
  DesignCertificateTemplateDialogData,
} from './context';
import {
  CertificateTemplatePreview,
  VariablesConfig,
  DesignConfig,
  ContentConfig,
} from './components';

export interface DesignCertificateTemplateDialogProps {
  service: Service;
}

const DesignCertificateTemplateDialog: React.FC<
  DesignCertificateTemplateDialogProps
> = ({ service }) => {
  const {
    isDesignCertificateTemplateDialogOpen,
    toggleDesignCertificateTemplateDialog,
  } = useServiceCard();

  const confirm = useConfirm();

  const {
    formState: { isDirty },
    reset,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleDesignCertificateTemplateDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleDesignCertificateTemplateDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleDesignCertificateTemplateDialog, confirm]);

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
              sx={{
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />
          }
          sx={{ height: '100%' }}
        >
          <Stack
            sx={{
              flex: { md: 2 },
              paddingX: (theme) => theme.spacing(0.5),
            }}
          >
            <CertificateTemplatePreview service={service} />
          </Stack>

          <Stack
            sx={{
              flex: { md: 1 },
              paddingX: (theme) => theme.spacing(0.5),
              overflow: 'auto',
            }}
          >
            <VariablesConfig />
            <DesignConfig />
            <ContentConfig />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
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
> = (props) => (
  <DesignCertificateTemplateDialogProvider>
    <DesignCertificateTemplateDialog {...props} />
  </DesignCertificateTemplateDialogProvider>
);

export { DesignCertificateTemplateDialogWrapper as DesignCertificateTemplateDialog };

export default DesignCertificateTemplateDialogWrapper;
