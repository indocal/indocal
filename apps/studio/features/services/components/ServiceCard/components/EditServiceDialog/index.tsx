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
  ControlledServiceStatusSelect,
  ControlledServiceRequestStatusSelect,
  ControlledFormsAutocomplete,
} from '@indocal/forms-generator';
import {
  Can,
  Service,
  ServiceStatus,
  ServiceRequestStatus,
  ApiEndpoints,
} from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useServiceCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      title: zod
        .string({
          description: 'Título del servicio',
          required_error: 'Debe ingresar el título del servicio',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del servicio')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del servicio',
          required_error: 'Debe ingresar la descripción del servicio',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar la descripción del servicio')
        .trim(),

      status: zod
        .enum<string, [ServiceStatus, ...ServiceStatus[]]>(
          ['DRAFT', 'PUBLISHED', 'HIDDEN'],
          {
            description: 'Estado del servicio',
            required_error: 'Debe seleccionar el estado del servicio',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Estado del servicio'),

      supportedRequestStatus: zod
        .enum<string, [ServiceRequestStatus, ...ServiceRequestStatus[]]>(
          [
            'PENDING',
            'PENDING_APPROVAL',
            'PENDING_PAYMENT',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED',
          ],
          {
            description: 'Estados soportados por el servicio',
            required_error:
              'Debe seleccionar los estados soportados por el servicio',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Estados soportados por el servicio')
        .array()
        .min(2, 'Debe seleccionar al menos dos estados'),

      form: entitySchema({
        description: 'Formulario del servicio',
        required_error: 'Debe seleccionar el formulario del servicio',
        invalid_type_error: 'Formato no válido',
      }),
    },
    {
      description: 'Datos del servicio',
      required_error: 'Debe ingresar los datos del servicio',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditServiceDialogProps {
  service: Service;
}

export const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  service,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditServiceDialogOpen, toggleEditServiceDialog } = useServiceCard();

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
      title: service.title,
      description: service.description,
      status: service.status,
      supportedRequestStatus: service.supportedRequestStatus,
      form: service.form,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { service: updated, error } = await indocal.services.update(
        service.id,
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          supportedRequestStatus: formData.supportedRequestStatus,
          form: formData.form?.id,
        }
      );

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
        await mutate(`${ApiEndpoints.SERVICES}/${service.id}`, updated);

        enqueueSnackbar('Servicio editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditServiceDialog,
        });
      }
    },
    [service.id, mutate, toggleEditServiceDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditServiceDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditServiceDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditServiceDialog, confirm]);

  return (
    <Dialog fullWidth open={isEditServiceDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar servicio</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
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
            required
            multiline
            autoComplete="off"
            label="Descripción"
            disabled={isSubmitting}
            inputProps={register('description')}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />

          <ControlledServiceStatusSelect
            required
            name="status"
            label="Estado"
            control={control as unknown as Control}
            disabled={isSubmitting}
          />

          <ControlledServiceRequestStatusSelect
            required
            name="supportedRequestStatus"
            label="Estados soportados"
            control={control as unknown as Control}
            disabled={isSubmitting}
            selectProps={{ multiple: true }}
          />

          <Can I="read" a="form">
            <ControlledFormsAutocomplete
              required
              name="form"
              label="Formulario"
              control={control as unknown as Control}
              disabled={isSubmitting}
            />
          </Can>
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

export default EditServiceDialog;
