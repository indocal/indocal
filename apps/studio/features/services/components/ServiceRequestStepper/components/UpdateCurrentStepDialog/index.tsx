import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import { MultipleStopOutlined as NextStepIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledCheckbox, ControlledFilesDropzone } from '@indocal/ui';
import {
  translateServiceRequestStatus,
  UUID,
  ServiceRequest,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceRequestStepper } from '../../context';

export interface UpdateCurrentStepDialogProps {
  request: ServiceRequest;
  nextStepType: 'nextStepOnApprove' | 'nextStepOnReject';
}

export const UpdateCurrentStepDialog: React.FC<
  UpdateCurrentStepDialogProps
> = ({ request, nextStepType }) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
    {
      comment: zod
        .object(
          {
            isInternal: zod.boolean({
              description: '¿Comentario interno?',
              required_error: 'Debe indicar si el comentario es interno o no',
              invalid_type_error: 'Formato no válido',
            }),

            content: zod
              .string({
                description: 'Comentario',
                required_error: 'Debe ingresar el comentario',
                invalid_type_error: 'Formato no válido',
              })
              .trim(),

            attachments: zod
              .instanceof(File, {
                message: 'Debe seleccionar los archivos a cargar',
              })
              .array(),
          },
          {
            description: 'Comentario',
            required_error: 'Debe ingresar los datos del comentario',
            invalid_type_error: 'Formato no válido',
          }
        )
        .partial(),
    },
    {
      description: 'Aceptar o rechazar paso actual',
      required_error: 'Debe ingresar los datos requeridos',
      invalid_type_error: 'Formato no válido',
    }
  );

  const { data: session } = useSession();

  const { mutate } = useSWRConfig();

  const { isUpdateCurrentStepDialogOpen, toggleUpdateCurrentStepDialog } =
    useServiceRequestStepper();

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
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      confirm({
        title:
          nextStepType === 'nextStepOnApprove'
            ? 'Aprobar paso actual'
            : 'Rechazar paso actual',

        description:
          nextStepType === 'nextStepOnApprove'
            ? 'Estás seguro de que deseas aprobar este paso?'
            : 'Estás seguro de que deseas rechazar este paso?',
      })
        .then(async () => {
          const { error } =
            await indocal.services.requests.approveOrRejectCurrentStep({
              request: request.id,
              action:
                nextStepType === 'nextStepOnApprove' ? 'APPROVE' : 'REJECT',
              author: session?.user.id as UUID,
              comment: formData.comment.content,
              attachments: formData.comment.attachments,
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

            enqueueSnackbar(
              nextStepType === 'nextStepOnApprove'
                ? 'Paso aprobado exitosamente'
                : 'Paso rechazado exitosamente',
              {
                variant: 'success',
                onEntered: toggleUpdateCurrentStepDialog,
              }
            );
          }
        })
        .catch(() => undefined);
    },
    [
      nextStepType,
      request.id,
      session?.user.id,
      mutate,
      toggleUpdateCurrentStepDialog,
      enqueueSnackbar,
      confirm,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleUpdateCurrentStepDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleUpdateCurrentStepDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleUpdateCurrentStepDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isUpdateCurrentStepDialogOpen}
      onClose={handleOnClose}
    >
      <DialogTitle>
        {nextStepType === 'nextStepOnApprove'
          ? 'Aprobar paso actual'
          : 'Rechazar paso actual'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Chip label={request.currentStep?.title} sx={{ flex: 1 }} />

            <NextStepIcon />

            <Chip
              label={
                nextStepType === 'nextStepOnApprove'
                  ? request.currentStep?.nextStepOnApprove?.title
                  : request.currentStep?.nextStepOnReject?.title
              }
              sx={{ flex: 1 }}
            />
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Chip
              label={translateServiceRequestStatus(request.status)}
              sx={{ flex: 1 }}
            />

            {request.currentStep && (
              <>
                <NextStepIcon />

                <Chip
                  label={translateServiceRequestStatus(
                    request.currentStep.nextRequestStatus
                  )}
                  sx={{ flex: 1 }}
                />
              </>
            )}
          </Stack>

          <Stack component="form">
            <Stack
              component="fieldset"
              spacing={2}
              divider={<Divider flexItem />}
              sx={{
                borderRadius: (theme) => theme.spacing(0.5),
                borderColor: (theme) => theme.palette.divider,
              }}
            >
              <Typography component="legend" variant="subtitle2">
                Comentarios y evidencias (opcional)
              </Typography>

              <ControlledCheckbox
                name="comment.isInternal"
                label="¿Comentario interno?"
                control={control as unknown as Control}
                formControlProps={{
                  disabled: isSubmitting,
                  sx: { marginLeft: 'auto' },
                }}
              />

              <Stack spacing={2}>
                <TextField
                  multiline
                  autoComplete="off"
                  label="Comentario"
                  disabled={isSubmitting}
                  inputProps={register('comment.content')}
                  error={Boolean(errors.comment?.content)}
                  helperText={errors.comment?.content?.message}
                />

                <ControlledFilesDropzone
                  multiple
                  name="comment.attachments"
                  description="Evidencias (archivos)"
                  control={control as unknown as Control}
                  disabled={isSubmitting}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color={nextStepType === 'nextStepOnApprove' ? 'success' : 'error'}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {nextStepType === 'nextStepOnApprove' ? 'Aprobar' : 'Rechazar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCurrentStepDialog;
