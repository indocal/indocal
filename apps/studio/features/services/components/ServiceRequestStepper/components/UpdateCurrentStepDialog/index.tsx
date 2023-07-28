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
  action: 'APPROVE' | 'REJECT';
}

export const UpdateCurrentStepDialog: React.FC<
  UpdateCurrentStepDialogProps
> = ({ request, action }) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
    {
      comment: zod
        .object(
          {
            include: zod
              .boolean({
                description: '¿Incluir comentario?',
                required_error: 'Debe indicar si desea incluir un comentario',
                invalid_type_error: 'Formato no válido',
              })
              .nullish(),

            isInternal: zod
              .boolean({
                description: '¿Comentario interno?',
                required_error: 'Debe indicar si el comentario es interno o no',
                invalid_type_error: 'Formato no válido',
              })
              .nullish(),

            content: zod
              .string({
                description: 'Comentario',
                required_error: 'Debe ingresar el comentario',
                invalid_type_error: 'Formato no válido',
              })
              .trim()
              .nullish(),

            attachments: zod
              .instanceof(File, {
                message: 'Debe seleccionar los archivos a cargar',
              })
              .array()
              .nullish(),
          },
          {
            description: 'Comentario',
            required_error: 'Debe ingresar los datos del comentario',
            invalid_type_error: 'Formato no válido',
          }
        )
        .refine((data) => !data.include || (data.include && data.content), {
          message: 'Debe ingresar el comentario',
          path: ['content'],
        }),
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
    watch,
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const includeComment = watch('comment.include');

  const onSubmit = useCallback(
    async (formData: FormData) => {
      confirm({
        title:
          action === 'APPROVE' ? 'Aprobar paso actual' : 'Rechazar paso actual',

        description:
          action === 'APPROVE'
            ? '¿Estás seguro de que deseas aprobar este paso?'
            : '¿Estás seguro de que deseas rechazar este paso?',
      })
        .then(async () => {
          const { error } =
            await indocal.services.requests.approveOrRejectCurrentStep({
              request: request.id,
              action: action,
              ...(formData.comment.include &&
                formData.comment.content && {
                  comment: {
                    isInternal: Boolean(formData.comment.isInternal),
                    content: formData.comment.content,
                    attachments: formData.comment.attachments ?? [],
                    author: session?.user.id as UUID,
                  },
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
            await mutate(`${ApiEndpoints.SERVICES_REQUESTS}/${request.id}`);

            enqueueSnackbar(
              action === 'APPROVE'
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
      action,
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
        {action === 'APPROVE' ? 'Aprobar paso actual' : 'Rechazar paso actual'}
      </DialogTitle>

      <DialogContent dividers>
        <Stack component="form" spacing={1} divider={<Divider flexItem />}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ padding: (theme) => theme.spacing(0.5), overflowX: 'auto' }}
          >
            <Chip label={request.currentStep?.title} sx={{ flex: 1 }} />

            {request.currentStep && (
              <>
                <NextStepIcon />

                <Chip
                  label={
                    action === 'APPROVE'
                      ? request.currentStep.nextStepOnApprove?.title
                      : request.currentStep.nextStepOnReject?.title
                  }
                  sx={{ flex: 1 }}
                />
              </>
            )}
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ padding: (theme) => theme.spacing(0.5), overflowX: 'auto' }}
          >
            <Chip
              label={translateServiceRequestStatus(request.status)}
              sx={{ flex: 1 }}
            />

            {action === 'APPROVE' &&
              request?.currentStep?.nextStepOnApprove && (
                <>
                  <NextStepIcon />

                  <Chip
                    label={translateServiceRequestStatus(
                      request.currentStep.nextStepOnApprove.nextRequestStatus
                    )}
                    sx={{ flex: 1 }}
                  />
                </>
              )}

            {action === 'REJECT' && request?.currentStep?.nextStepOnReject && (
              <>
                <NextStepIcon />

                <Chip
                  label={translateServiceRequestStatus(
                    request.currentStep.nextStepOnReject.nextRequestStatus
                  )}
                  sx={{ flex: 1 }}
                />
              </>
            )}
          </Stack>

          <Stack spacing={1} sx={{ padding: (theme) => theme.spacing(1) }}>
            <Typography variant="subtitle2" align="center">
              Comentarios y evidencias (opcional)
            </Typography>

            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <ControlledCheckbox
                name="comment.include"
                label="¿Incluir comentario?"
                control={control as unknown as Control}
                formControlProps={{ disabled: isSubmitting }}
              />

              <ControlledCheckbox
                name="comment.isInternal"
                label="¿Comentario interno?"
                control={control as unknown as Control}
                formControlProps={{
                  disabled: isSubmitting || !includeComment,
                }}
              />
            </Stack>

            <Stack spacing={2}>
              <TextField
                multiline
                autoComplete="off"
                label="Comentario"
                required={Boolean(includeComment)}
                disabled={isSubmitting || !includeComment}
                inputProps={register('comment.content')}
                error={Boolean(errors.comment?.content)}
                helperText={errors.comment?.content?.message}
              />

              <ControlledFilesDropzone
                multiple
                name="comment.attachments"
                description="Evidencias (archivos)"
                control={control as unknown as Control}
                required={Boolean(includeComment)}
                disabled={isSubmitting || !includeComment}
                dropzoneProps={{ maxSize: 5 * 1024 * 1024 }}
              />
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color={action === 'APPROVE' ? 'success' : 'error'}
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {action === 'APPROVE' ? 'Aprobar' : 'Rechazar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCurrentStepDialog;
