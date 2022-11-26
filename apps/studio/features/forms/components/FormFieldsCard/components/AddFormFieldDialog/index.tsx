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
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { Form, FormFieldType, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';
import { ControlledFormFieldTypeSelect } from '@/features';

import { useFormFieldsCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
    type: zod
      .enum<string, [FormFieldType, ...FormFieldType[]]>(
        [
          'TEXT',
          'TEXTAREA',
          'NUMBER',

          'DNI',
          'PHONE',
          'EMAIL',

          'CHECKBOX',
          'SELECT',
          'RADIO',

          'TIME',
          'DATE',
          'DATETIME',

          'USERS',

          'TABLE',
        ],
        {
          description: 'Tipo del campo',
          required_error: 'Debe seleccionar el tipo del campo',
          invalid_type_error: 'Formato no válido',
        }
      )
      .describe('Tipo del campo'),

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
      .optional(),
  },
  {
    description: 'Datos del campo',
    required_error: 'Debe ingresar los datos del campo',
    invalid_type_error: 'Formato no válido',
  }
);

export interface AddFormFieldDialogProps {
  form: Form;
}

export const AddFormFieldDialog: React.FC<AddFormFieldDialogProps> = ({
  form,
}) => {
  const { mutate } = useSWRConfig();

  const { isAddFormFieldDialogOpen, toggleAddFormFieldDialog } =
    useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'TEXT',
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { error } = await indocal.forms.fields.create(form.id, {
        type: formData.type,
        title: formData.title,
        ...(formData.description && { description: formData.description }),
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

        enqueueSnackbar('Campo agregado exitosamente', {
          variant: 'success',
          onEntered: toggleAddFormFieldDialog,
        });
      }
    },
    [form.id, mutate, toggleAddFormFieldDialog, enqueueSnackbar]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddFormFieldDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddFormFieldDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddFormFieldDialog]);

  return (
    <Dialog fullWidth open={isAddFormFieldDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar campo</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <ControlledFormFieldTypeSelect
            required
            name="type"
            label="Tipo"
            control={control as unknown as Control}
            disabled={isSubmitting}
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

export default AddFormFieldDialog;
