import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Stack,
  Divider,
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

import { ControlledCheckbox, ControlledFilesDropzone } from '@indocal/ui';
import { UUID, ServiceRequest, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceRequestComments } from '../../context';

export interface AddCommentDialogProps {
  request: ServiceRequest;
}

export const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  request,
}) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod.object(
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
        .min(1, 'Deebe ingresar el comentario')
        .trim(),

      attachments: zod
        .instanceof(File, {
          message: 'Debe seleccionar las evidencias a cargar',
        })
        .array()
        .optional(),
    },
    {
      description: 'Datos del comentario',
      required_error: 'Debe ingresar los datos del comentario',
      invalid_type_error: 'Formato no válido',
    }
  );

  const { data: session } = useSession();

  const { mutate } = useSWRConfig();

  const { isAddCommentDialogOpen, toggleAddCommentDialog } =
    useServiceRequestComments();

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
      isInternal: false,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.comments.create({
        isInternal: formData.isInternal,
        content: formData.content,
        attachments: formData.attachments,
        author: session?.user.id as UUID,
        attach: { model: 'request', entity: request.id },
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

        enqueueSnackbar('Comentario agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddCommentDialog,
        });
      }
    },
    [
      request.id,
      session?.user.id,
      mutate,
      toggleAddCommentDialog,
      enqueueSnackbar,
    ]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleAddCommentDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleAddCommentDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleAddCommentDialog, confirm]);

  return (
    <Dialog fullWidth open={isAddCommentDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar comentario</DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          autoComplete="off"
          spacing={2}
          divider={<Divider flexItem />}
        >
          <ControlledCheckbox
            name="isInternal"
            label="¿Comentario interno?"
            control={control as unknown as Control}
            formControlProps={{
              disabled: isSubmitting,
              sx: { marginLeft: 'auto' },
            }}
          />

          <Stack spacing={2}>
            <TextField
              required
              multiline
              autoComplete="off"
              label="Comentario"
              disabled={isSubmitting}
              inputProps={register('content')}
              error={Boolean(errors.content)}
              helperText={errors.content?.message}
            />

            <ControlledFilesDropzone
              multiple
              name="attachments"
              description="Evidencias (archivos)"
              control={control as unknown as Control}
              disabled={isSubmitting}
            />
          </Stack>
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

export default AddCommentDialog;
