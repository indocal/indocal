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

import { Form, FormField, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormFieldsCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object(
    {
      title: zod
        .string({
          description: 'Título del campo',
          required_error: 'Debe ingresar el título del campo',
          invalid_type_error: 'Formato no válido',
        })
        .min(1, 'Debe ingresar el título del campo')
        .trim(),

      description: zod
        .string({
          description: 'Descripción del campo',
          required_error: 'Debe ingresar la descripción del campo',
          invalid_type_error: 'Formato no válido',
        })
        .trim()
        .nullable(),
    },
    {
      description: 'Datos del campo',
      required_error: 'Debe ingresar los datos del campo',
      invalid_type_error: 'Formato no válido',
    }
  )
  .partial();

export interface EditFormFieldDialogProps {
  form: Form;
  field: FormField;
}

export const EditFormFieldDialog: React.FC<EditFormFieldDialogProps> = ({
  form,
  field,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditFormFieldDialogOpen, toggleEditFormFieldDialog } =
    useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: field.title,
      description: field.description,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.forms.fields.update(field.id, {
        title: formData.title,
        description: formData.description || null,
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
        await mutate(`${ApiEndpoints.FORMS}/${form.id}`);

        enqueueSnackbar('Campo editado exitosamente', {
          variant: 'success',
          onEntered: toggleEditFormFieldDialog,
        });
      }
    },
    [form.id, field.id, mutate, toggleEditFormFieldDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleEditFormFieldDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditFormFieldDialog();
      reset();
    }
  }, [isDirty, reset, toggleEditFormFieldDialog]);

  return (
    <Dialog fullWidth open={isEditFormFieldDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Editar campo</DialogTitle>

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

export default EditFormFieldDialog;
