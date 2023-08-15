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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  ServiceRequest,
  ServiceRequestStatus,
  ApiEndpoints,
} from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';

import { useServiceRequestCard } from '../../context';

import ControlledServiceRequestStatusSelect from '../ControlledServiceRequestStatusSelect';
import ControlledServiceProcessStepsAutocomplete from '../ControlledServiceProcessStepsAutocomplete';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      status: zod.enum<
        string,
        [ServiceRequestStatus, ...ServiceRequestStatus[]]
      >(
        [
          'PENDING',
          'PENDING_APPROVAL',
          'PENDING_PAYMENT',
          'IN_PROGRESS',
          'COMPLETED',
          'CANCELLED',
        ],
        {
          description: 'Estado de la solicitud',
          required_error: 'Debe seleccionar el estado de la solicitud',
          invalid_type_error: 'Formato no válido',
        }
      ),

      currentStep: entitySchema({
        description: 'Paso actual de la solicitud',
        required_error: 'Debe seleccionar el paso actual de la solicitud',
        invalid_type_error: 'Formato no válido',
      }),
    },
    {
      description: 'Datos de la solicitud',
      required_error: 'Debe ingresar los datos de la solicitud',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditServiceRequestDialogProps {
  request: ServiceRequest;
}

export const EditServiceRequestDialog: React.FC<
  EditServiceRequestDialogProps
> = ({ request }) => {
  const { mutate } = useSWRConfig();

  const { isEditServiceRequestDialogOpen, toggleEditServiceRequestDialog } =
    useServiceRequestCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: request.status,
      ...(request.currentStep && { currentStep: request.currentStep }),
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { request: updated, error } =
        await indocal.services.requests.update(request.id, {
          status: formData.status,
          ...(formData.currentStep && { currentStep: formData.currentStep.id }),
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
        await mutate(
          `${ApiEndpoints.SERVICES_REQUESTS}/${request.id}`,
          updated
        );

        enqueueSnackbar('Solicitud editada exitosamente', {
          variant: 'success',
          onEntered: toggleEditServiceRequestDialog,
        });
      }
    },
    [request.id, mutate, toggleEditServiceRequestDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditServiceRequestDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditServiceRequestDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditServiceRequestDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isEditServiceRequestDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>Editar solicitud</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledServiceRequestStatusSelect
            request={request}
            required
            name="status"
            label="Estado"
            control={control as unknown as Control}
            disabled={isSubmitting}
          />

          <ControlledServiceProcessStepsAutocomplete
            service={request.service.id}
            required
            name="currentStep"
            label="Paso actual"
            control={control as unknown as Control}
            disabled={isSubmitting}
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditServiceRequestDialog;
