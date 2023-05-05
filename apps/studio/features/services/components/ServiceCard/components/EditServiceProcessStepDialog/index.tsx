import { useState, useCallback } from 'react';
import {
  Stack,
  Divider,
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
import { TabContext, TabList, TabPanel, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledUsersAutocomplete } from '@indocal/forms-generator';
import { Can, Service, ApiEndpoints } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useServiceCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      title: zod
        .string({
          description: 'Título del paso',
          required_error: 'Debe ingresar el título del paso',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del paso')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del paso',
          required_error: 'Debe ingresar la descripción del paso',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),

      owners: entitySchema({
        description: 'Responsables del paso',
        required_error: 'Debe seleccionar los responsables del paso',
        invalid_type_error: 'Formato no válido',
      })
        .array()
        .min(1, 'Debe seleccionar al menos un responsable'),
    },
    {
      description: 'Datos del paso',
      required_error: 'Debe ingresar los datos del paso',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditServiceProcessStepDialogProps {
  service: Service;
  step: Service['steps'][number];
}

export const EditServiceProcessStepDialog: React.FC<
  EditServiceProcessStepDialogProps
> = ({ service, step }) => {
  const { mutate } = useSWRConfig();

  const {
    isEditServiceProcessStepDialogOpen,
    toggleEditServiceProcessStepDialog,
  } = useServiceCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: step.title,
      description: step.description,
      owners: step.owners,
    },
  });

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.services.steps.update(step.id, {
        title: formData.title,
        description: formData.description || null,

        ...(formData.owners && {
          owners: formData.owners.map((owner) => owner.id),
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
        await mutate(`${ApiEndpoints.SERVICES}/${service.id}`);

        enqueueSnackbar('Paso editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditServiceProcessStepDialog,
        });
      }
    },
    [
      service.id,
      step.id,
      mutate,
      toggleEditServiceProcessStepDialog,
      enqueueSnackbar,
    ]
  );

  const handleDelete = useCallback(async () => {
    const answer = window.confirm(
      '¿Estás seguro de que deseas eliminar este paso?'
    );

    if (!answer) return;

    const { error } = await indocal.services.steps.delete(step.id);

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

      enqueueSnackbar('Paso eliminado exitosamente', {
        variant: 'success',
        onEntered: toggleEditServiceProcessStepDialog,
      });
    }
  }, [
    service.id,
    step.id,
    mutate,
    toggleEditServiceProcessStepDialog,
    enqueueSnackbar,
  ]);

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditServiceProcessStepDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditServiceProcessStepDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditServiceProcessStepDialog]);

  return (
    <Dialog
      fullWidth
      open={isEditServiceProcessStepDialogOpen}
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
        <Typography fontWeight="bolder">Editar paso</Typography>

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
              <Stack spacing={2} divider={<Divider flexItem />}>
                <Stack spacing={2}>
                  <TextField
                    required
                    autoComplete="off"
                    label="Título"
                    disabled={isSubmitting}
                    inputProps={register('title')}
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                  />

                  <TextField
                    multiline
                    autoComplete="off"
                    label="Descripción"
                    disabled={isSubmitting}
                    inputProps={register('description')}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                  />
                </Stack>
              </Stack>
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>
              <Stack spacing={2} divider={<Divider flexItem />}>
                <Stack spacing={2}>
                  <Can I="read" an="user">
                    <ControlledUsersAutocomplete
                      required
                      multiple
                      name="owners"
                      label="Responsables"
                      control={control as unknown as Control}
                      disabled={isSubmitting}
                    />
                  </Can>
                </Stack>
              </Stack>
            </TabPanel>
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

export default EditServiceProcessStepDialog;
