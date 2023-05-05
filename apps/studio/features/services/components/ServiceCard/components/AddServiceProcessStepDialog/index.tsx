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
} from '@mui/material';
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

const schema = zod.object(
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
      .optional(),

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
);

export interface AddServiceProcessStepDialogProps {
  service: Service;
}

export const AddServiceProcessStepDialog: React.FC<
  AddServiceProcessStepDialogProps
> = ({ service }) => {
  const { mutate } = useSWRConfig();

  const {
    isAddServiceProcessStepDialogOpen,
    toggleAddServiceProcessStepDialog,
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
  });

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.services.steps.create(service.id, {
        title: formData.title,
        ...(formData.description && { description: formData.description }),
        owners: formData.owners.map((owner) => owner.id),
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

        enqueueSnackbar('Paso agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddServiceProcessStepDialog,
        });
      }
    },
    [service.id, mutate, toggleAddServiceProcessStepDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddServiceProcessStepDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddServiceProcessStepDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddServiceProcessStepDialog]);

  return (
    <Dialog
      fullWidth
      open={isAddServiceProcessStepDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Agregar paso</DialogTitle>

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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceProcessStepDialog;
