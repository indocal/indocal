import { useMemo, useCallback } from 'react';
import {
  Stack,
  Unstable_Grid2,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import {
  FilePresent as FileIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { ControlledCheckbox, ControlledFilesDropzone } from '@indocal/ui';
import { ServiceRequest, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useServiceRequestComments } from '../../context';

export interface EditCommentDialogProps {
  request: ServiceRequest;
  comment: ServiceRequest['comments'][number];
}

export const EditCommentDialog: React.FC<EditCommentDialogProps> = ({
  request,
  comment,
}) => {
  type FormData = zod.infer<typeof schema>;

  const schema = zod
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
    )
    .partial();

  const { mutate } = useSWRConfig();

  const { isEditCommentDialogOpen, toggleEditCommentDialog } =
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
      isInternal: comment.isInternal,
      content: comment.content,
    },
  });

  const icons = useMemo<Record<string, React.ReactElement>>(
    () => ({
      text: <FileIcon />,
      image: <ImageIcon />,
      video: <VideoIcon />,
      audio: <AudioIcon />,
    }),
    []
  );

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.comments.update(comment.id, {
        isInternal: formData.isInternal,
        content: formData.content,
        ...(formData.attachments && { attachments: formData.attachments }),
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

        enqueueSnackbar('Comentario editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditCommentDialog,
        });
      }
    },
    [request.id, comment.id, mutate, toggleEditCommentDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditCommentDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditCommentDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditCommentDialog, confirm]);

  return (
    <Dialog fullWidth open={isEditCommentDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar comentario</DialogTitle>

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
              dropzoneProps={{ maxSize: 5 * 1024 * 1024 }}
            />

            {comment.attachments.length > 0 && (
              <Unstable_Grid2
                component="fieldset"
                container
                spacing={1}
                sx={{
                  borderRadius: (theme) => theme.spacing(0.5),
                  borderColor: (theme) => theme.palette.divider,
                }}
              >
                <Typography component="legend" variant="subtitle2">
                  Evidencias previas
                </Typography>

                {comment.attachments.map((attachment) => {
                  const [mime] = attachment.mime.split('/');

                  const url = new URL(
                    attachment.path,
                    process.env.NEXT_PUBLIC_BACKEND_URL
                  );

                  return (
                    <Unstable_Grid2 key={attachment.id}>
                      <Button
                        component={Link}
                        size="small"
                        variant="outlined"
                        href={url.toString()}
                        target="_blank"
                        startIcon={icons[mime] ?? <FileIcon />}
                        sx={{ width: 'fit-content' }}
                      >
                        {attachment.name}
                      </Button>
                    </Unstable_Grid2>
                  );
                })}
              </Unstable_Grid2>
            )}
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditCommentDialog;
