import { useCallback } from 'react';
import { useRouter } from 'next/router';
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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import {
  ControlledServiceRequestStatusSelect,
  ControlledFormsAutocomplete,
} from '@indocal/forms-generator';
import { ServiceRequestStatus } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useServicesDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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
      .trim()
      .optional(),

    supportedRequestStatus: zod
      .enum<string, [ServiceRequestStatus, ...ServiceRequestStatus[]]>(
        [
          'PENDING',
          'PENDING_APPROVAL',
          'PENDING_PAYMENT',
          'IN_PROGRESS',
          'COMPLETED',
          'CANCELED',
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
);

export const AddServiceDialog: React.FC = () => {
  const router = useRouter();

  const { isAddServiceDialogOpen, toggleAddServiceDialog } =
    useServicesDataGrid();

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
      supportedRequestStatus: [
        'PENDING',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELED',
      ],
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { service, error } = await indocal.services.create({
        title: formData.title,
        ...(formData.description && { description: formData.description }),
        supportedRequestStatus: formData.supportedRequestStatus,
        form: formData.form.id,
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
        await router.push(`${Pages.SERVICES}/${service?.id}`);

        enqueueSnackbar('Servicio agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddServiceDialog,
        });
      }
    },
    [router, toggleAddServiceDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddServiceDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: 'Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddServiceDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddServiceDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddServiceDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar servicio</DialogTitle>

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
            multiline
            autoComplete="off"
            label="Descripción"
            disabled={isSubmitting}
            inputProps={register('description')}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />

          <ControlledServiceRequestStatusSelect
            required
            name="supportedRequestStatus"
            label="Estados soportados"
            control={control as unknown as Control}
            disabled={isSubmitting}
            selectProps={{ multiple: true }}
          />

          <ControlledFormsAutocomplete
            required
            name="form"
            label="Formulario"
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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
