import { useState, useMemo, useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import {
  Service,
  ServiceCertificateTemplatePlaceholderType,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import { usePlaceholdersConfig } from '../../context';

import {
  EditPlaceholderDialogProvider,
  EditPlaceholderDialogData,
} from './context';
import {
  TextPlaceholderConfig,
  SignaturePlaceholderConfig,
  SectionPlaceholderConfig,
  TablePlaceholderConfig,
} from './components';

export interface EditPlaceholderDialogProps {
  placeholder: NonNullable<Service['template']>['placeholders'][number];
}

const EditPlaceholderDialog: React.FC<EditPlaceholderDialogProps> = ({
  placeholder,
}) => {
  const { mutate } = useSWRConfig();

  const { service, isEditPlaceholderDialogOpen, toggleEditPlaceholderDialog } =
    usePlaceholdersConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    reset,
    handleSubmit,
  } = useFormContext<EditPlaceholderDialogData>();

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const options = useMemo<
    Record<ServiceCertificateTemplatePlaceholderType, React.ReactElement>
  >(
    () => ({
      TEXT: <TextPlaceholderConfig placeholder={placeholder} />,
      SIGNATURE: <SignaturePlaceholderConfig placeholder={placeholder} />,
      IMAGE: <SignaturePlaceholderConfig placeholder={placeholder} />,
      SECTION: <SectionPlaceholderConfig />,
      TABLE: <TablePlaceholderConfig />,
    }),
    [placeholder]
  );

  const onSubmit = useCallback(
    async (formData: EditPlaceholderDialogData) => {
      if (!service.template) return;

      const placeholders = structuredClone(service.template.placeholders);

      const index = service.template.placeholders.findIndex(
        (current) => current.name === placeholder.name
      );

      const data = {
        type: placeholder.type,
        name: formData.name,
        title: formData.title,
        ...(formData.config && { config: formData.config }),
      };

      placeholders.splice(index, 1, data);

      const { error } = await indocal.services.templates.upsert(service.id, {
        placeholders,
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

        enqueueSnackbar('Placeholder editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditPlaceholderDialog,
        });
      }
    },
    [placeholder, service, mutate, toggleEditPlaceholderDialog, enqueueSnackbar]
  );

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Eliminar placeholder',
      description: '¿Estás seguro de que deseas eliminar este placeholder?',
    }).then(async () => {
      if (!service.template) return;

      const placeholders = structuredClone(service.template.placeholders);

      const index = service.template.placeholders.findIndex(
        (current) => current.name === placeholder.name
      );

      placeholders.splice(index, 1);

      const { error } = await indocal.services.templates.upsert(service.id, {
        placeholders,
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

        enqueueSnackbar('Placeholder eliminado exitosamente', {
          variant: 'success',
          onEntered: toggleEditPlaceholderDialog,
        });
      }
    });
  }, [
    placeholder,
    service,
    mutate,
    toggleEditPlaceholderDialog,
    enqueueSnackbar,
    confirm,
  ]);

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditPlaceholderDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditPlaceholderDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditPlaceholderDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isEditPlaceholderDialogOpen}
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
        <Typography fontWeight="bolder">Editar placeholder</Typography>

        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack component="form" autoComplete="off">
          <TabContext value={tab}>
            <TabList
              variant="fullWidth"
              onChange={(_, value) => setTab(value)}
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <Tab label="Información" value={Tabs.INFO} />
              <Tab label="Configuración" value={Tabs.CONFIG} />
            </TabList>

            <TabPanel value={Tabs.INFO}>
              <Stack spacing={2}>
                <TextField
                  required
                  autoComplete="off"
                  label="Nombre"
                  disabled={isSubmitting}
                  inputProps={register('name')}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />

                <TextField
                  required
                  autoComplete="off"
                  label="Título"
                  disabled={isSubmitting}
                  inputProps={register('title')}
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              </Stack>
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>{options[placeholder.type]}</TabPanel>
          </TabContext>
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const EditPlaceholderDialogWrapper: React.FC<EditPlaceholderDialogProps> = ({
  placeholder,
}) => (
  <EditPlaceholderDialogProvider placeholder={placeholder}>
    <EditPlaceholderDialog placeholder={placeholder} />
  </EditPlaceholderDialogProvider>
);

export { EditPlaceholderDialogWrapper as EditPlaceholderDialog };

export default EditPlaceholderDialogWrapper;
