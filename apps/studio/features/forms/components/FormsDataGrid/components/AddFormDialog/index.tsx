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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useFormsDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
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
      .optional(),
  },
  {
    description: 'Datos del formulario',
    required_error: 'Debe ingresar los datos del formulario',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddFormDialog: React.FC = () => {
  const router = useRouter();

  const { isAddFormDialogOpen, toggleAddFormDialog } = useFormsDataGrid();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { form, error } = await indocal.forms.create({
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
        await router.push(`${Pages.FORMS}/${form?.id}`);

        enqueueSnackbar('Formulario agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddFormDialog,
        });
      }
    },
    [router, toggleAddFormDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddFormDialog();
    } else {
      const response = window.confirm(
        '¿Estás seguro que deseas cancelar esta acción?'
      );

      if (response) {
        toggleAddFormDialog();
        reset();
      }
    }
  }, [isDirty, reset, toggleAddFormDialog]);

  return (
    <Dialog fullWidth open={isAddFormDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar formulario</DialogTitle>

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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddFormDialog;
