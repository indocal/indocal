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

import { UserGroup } from '@indocal/services';

import { indocal } from '@/lib';
import { Pages } from '@/config';

import { useGroupFormsDataGrid } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {
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

export interface AddGroupFormDialogProps {
  group: UserGroup;
}

export const AddGroupFormDialog: React.FC<AddGroupFormDialogProps> = ({
  group,
}) => {
  const router = useRouter();

  const { isAddGroupFormDialogOpen, toggleAddGroupFormDialog } =
    useGroupFormsDataGrid();

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
        slug: [group.name, formData.title]
          .join(' ')
          .replaceAll(' ', '-')
          .toLowerCase(),

        title: formData.title,
        ...(formData.description && { description: formData.description }),
        group: group.id,
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
          onEntered: toggleAddGroupFormDialog,
        });
      }
    },
    [group.id, group.name, enqueueSnackbar, router, toggleAddGroupFormDialog]
  );

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleAddGroupFormDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleAddGroupFormDialog();
      reset();
    }
  }, [isDirty, reset, toggleAddGroupFormDialog]);

  return (
    <Dialog fullWidth open={isAddGroupFormDialogOpen} onClose={handleOnClose}>
      <DialogTitle>Agregar formulario</DialogTitle>

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
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroupFormDialog;
