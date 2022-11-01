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
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Form, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      slug: zod
        .string({
          description: 'Slug del formulario',
          required_error: 'Debe ingresar el slug del formulario',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el slug del formulario')
        .trim(),

      title: zod
        .string({
          description: 'Título del formulario',
          required_error: 'Debe ingresar el título del formulario',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del formulario')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del formulario',
          required_error: 'Debe ingresar la descripción del formulario',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),
    },
    {
      description: 'Datos del formulario',
      required_error: 'Debe ingresar los datos del formulario',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFormDialogProps {
  form: Form;
}

export const EditFormDialog: React.FC<EditFormDialogProps> = ({ form }) => {
  const { mutate } = useSWRConfig();

  const { isEditFormDialogOpen, toggleEditFormDialog } = useFormCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: form.slug,
      title: form.title,
      description: form.description,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { form: updated, error } = await indocal.forms.update(form.id, {
        slug: formData.slug,
        title: formData.title,
        description: formData.description,
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
        await mutate(`${ApiEndpoints.FORMS}/${form.id}`, updated);

        enqueueSnackbar('Formulario editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFormDialog,
        });
      }
    },
    [form.id, mutate, toggleEditFormDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditFormDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleEditFormDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleEditFormDialog]);

  return (
    <Dialog fullWidth open={isEditFormDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar formulario</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Slug"
            disabled={isSubmitting}
            inputProps={register('slug')}
            error={Boolean(errors.slug)}
            helperText={errors.slug?.message}
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

export default EditFormDialog;
