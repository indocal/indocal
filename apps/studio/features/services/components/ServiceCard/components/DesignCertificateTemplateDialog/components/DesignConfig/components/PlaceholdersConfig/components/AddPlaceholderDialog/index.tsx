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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  ServiceCertificateTemplatePlaceholderType,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import { usePlaceholdersConfig } from '../../context';

import ControlledServiceCertificateTemplatePlaceholderTypeSelect from '../ControlledServiceCertificateTemplatePlaceholderTypeSelect';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    type: zod.enum(
      [
        ServiceCertificateTemplatePlaceholderType.TEXT,
        ServiceCertificateTemplatePlaceholderType.SIGNATURE,
        ServiceCertificateTemplatePlaceholderType.SECTION,
        ServiceCertificateTemplatePlaceholderType.TABLE,
      ],
      {
        description: 'Tipo del placeholder',
        required_error: 'Debe ingresar el tipo del placeholder',
        invalid_type_error: 'Formato no válido',
      }
    ),

    name: zod
      .string({
        description: 'Nombre del placeholder',
        required_error: 'Debe ingresar el nombre del placeholder',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el nombre del placeholder'),

    title: zod
      .string({
        description: 'Título del placeholder',
        required_error: 'Debe ingresar el título del placeholder',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el título del placeholder'),
  },
  {
    description: 'Placeholders del certificado',
    required_error: 'Debe ingresar los placeholders del certificado',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddPlaceholderDialog: React.FC = () => {
  const { mutate } = useSWRConfig();

  const { service, isAddPlaceholderDialogOpen, toggleAddPlaceholderDialog } =
    usePlaceholdersConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: ServiceCertificateTemplatePlaceholderType.TEXT,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      if (!service.template) {
        enqueueSnackbar(
          'Antes de agregar un placeholder debe crear una plantilla básica',
          { variant: 'info' }
        );
        return;
      }

      const { error } = await indocal.services.templates.upsert(service.id, {
        placeholders: service.template.placeholders.concat({
          type: formData.type,
          name: formData.name,
          title: formData.title,
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

        enqueueSnackbar('Placeholder agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddPlaceholderDialog,
        });
      }
    },
    [service, mutate, toggleAddPlaceholderDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddPlaceholderDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddPlaceholderDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddPlaceholderDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddPlaceholderDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar placeholder</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledServiceCertificateTemplatePlaceholderTypeSelect
            required
            name="type"
            label="Tipo"
            control={control as unknown as Control}
            disabled={isSubmitting}
          />

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

export default AddPlaceholderDialog;
