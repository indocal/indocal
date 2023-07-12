import { useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Service, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { usePlaceholdersConfig } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
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

export interface EditPlaceholderDialogProps {
  placeholder: NonNullable<Service['template']>['placeholders'][number];
}

export const EditPlaceholderDialog: React.FC<EditPlaceholderDialogProps> = ({
  placeholder,
}) => {
  const { mutate } = useSWRConfig();

  const { service, isEditPlaceholderDialogOpen, toggleEditPlaceholderDialog } =
    usePlaceholdersConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: placeholder.name,
      title: placeholder.title,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      if (!service.template) return;

      const { error } = await indocal.services.templates.upsert(service.id, {
        placeholders: service.template.placeholders
          .filter((current) => current.name !== placeholder.name)
          .concat({
            type: placeholder.type,
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

        enqueueSnackbar('Placeholder editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditPlaceholderDialog,
        });
      }
    },
    [placeholder, service, mutate, toggleEditPlaceholderDialog, enqueueSnackbar]
  );

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Eliminar placeholder',
      description: '¿Estás seguro de que deseas eliminar este placeholder?',
    }).then(async () => {
      if (!service.template) return;

      const { error } = await indocal.services.templates.upsert(service.id, {
        placeholders: service.template.placeholders.filter(
          (current) => current.name !== placeholder.name
        ),
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

        enqueueSnackbar('Placeholder eliminado exitosamente', {
          variant: 'success',
          onEntered: toggleEditPlaceholderDialog,
        });
      }
    });
  }, [
    placeholder,
    service,
    mutate,
    toggleEditPlaceholderDialog,
    enqueueSnackbar,
    confirm,
  ]);

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditPlaceholderDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditPlaceholderDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditPlaceholderDialog, confirm]);

  return (
    <Dialog
      fullWidth
      open={isEditPlaceholderDialogOpen}
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
        <Typography fontWeight="bolder">Editar placeholder</Typography>

        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlaceholderDialog;
