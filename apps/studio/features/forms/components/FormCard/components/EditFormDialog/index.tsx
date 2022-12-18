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

import {
  Can,
  Form,
  FormStatus,
  FormVisibility,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';
import {
  ControlledFormStatusSelect,
  ControlledFormVisibilitySelect,
  ControlledUsersGroupsAutocomplete,
} from '@/features';

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

      status: zod
        .enum<string, [FormStatus, ...FormStatus[]]>(
          ['DRAFT', 'PUBLISHED', 'HIDDEN'],
          {
            description: 'Estado del formulario',
            required_error: 'Debe seleccionar el estado del formulario',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Estado del formulario'),

      visibility: zod
        .enum<string, [FormVisibility, ...FormVisibility[]]>(
          ['PUBLIC', 'PROTECTED', 'PRIVATE'],
          {
            description: 'Visibilidad del formulario',
            required_error: 'Debe seleccionar la visibilidad del formulario',
            invalid_type_error: 'Formato no válido',
          }
        )
        .describe('Visibilidad del formulario'),

      group: zod.object(
        {
          id: zod.string().uuid(),
          name: zod.string(),
          description: zod.string().nullable(),
          createdAt: zod.string(),
          updatedAt: zod.string(),
        },
        {
          description: 'Grupo al que pertenece el formulario',
          required_error: 'Debe seleccionar el grupo',
          invalid_type_error: 'Formato no válido',
        }
      ),
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
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: form.slug,
      title: form.title,
      description: form.description,
      status: form.status,
      visibility: form.visibility,
      group: form.group,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      const { form: updated, error } = await indocal.forms.update(form.id, {
        slug: formData.slug,
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        visibility: formData.visibility,
        group: formData.group?.id,
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
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleEditFormDialog();
      reset();
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

          <ControlledFormStatusSelect
            required
            name="status"
            label="Estado"
            control={control}
            disabled={isSubmitting}
          />

          <ControlledFormVisibilitySelect
            required
            name="visibility"
            label="Visibilidad"
            control={control}
            disabled={isSubmitting}
          />

          <Can I="read" an="userGroup">
            <ControlledUsersGroupsAutocomplete
              required
              name="group"
              label="Grupo"
              control={control as unknown as Control}
              disabled={isSubmitting}
            />
          </Can>
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
