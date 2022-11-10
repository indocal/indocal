import { useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Typography,
  IconButton,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Edit as EditIcon,
  ShortText as ShortTextIcon,
  WrapText as WrapTextIcon,
  Numbers as NumberIcon,
  ContactEmergency as DniIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CheckBox as CheckBoxIcon,
  List as ListIcon,
  RadioButtonChecked as RadioButtonIcon,
  Schedule as TimeIcon,
  DateRange as DateIcon,
  EventNote as DateTimeIcon,
  Group as UsersIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { NoData } from '@indocal/ui';
import { Form, FormFieldType, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormFieldsCard } from '../../context';

type FormData = zod.infer<typeof schema>;

const schema = zod.object(
  {},
  {
    description: 'Campos del formulario',
    required_error: 'Debe ingresar los campos del formulario',
    invalid_type_error: 'Formato no válido',
  }
);

export interface ManageFormFieldsDialogProps {
  form: Form;
}

export const ManageFormFieldsDialog: React.FC<ManageFormFieldsDialogProps> = ({
  form,
}) => {
  const { mutate } = useSWRConfig();

  const {
    isManageFormFieldsDialogOpen,
    toggleManageFormFieldsDialog,
    toggleAddFormFieldDialog,
  } = useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

  const {
    formState: { isDirty, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const icons = useMemo<Record<FormFieldType, React.ReactElement>>(
    () => ({
      TEXT: <ShortTextIcon />,
      TEXTAREA: <WrapTextIcon />,
      NUMBER: <NumberIcon />,
      DNI: <DniIcon />,
      PHONE: <PhoneIcon />,
      EMAIL: <EmailIcon />,
      CHECKBOX: <CheckBoxIcon />,
      SELECT: <ListIcon />,
      RADIO: <RadioButtonIcon />,
      TIME: <TimeIcon />,
      DATE: <DateIcon />,
      DATETIME: <DateTimeIcon />,
      USERS: <UsersIcon />,
    }),
    []
  );

  const onSubmit = useCallback(async () => {
    const { form: updated, error } = await indocal.forms.update(form.id, {});

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

      enqueueSnackbar('Campos actualizados exitosamente', {
        variant: 'success',
        onEntered: toggleManageFormFieldsDialog,
      });
    }
  }, [form.id, mutate, toggleManageFormFieldsDialog, enqueueSnackbar]);

  const handleOnClose = useCallback(async () => {
    if (!isDirty) {
      toggleManageFormFieldsDialog();
    } else {
      const answer = window.confirm(
        '¿Estás seguro de que deseas cancelar esta acción?'
      );

      if (!answer) return;

      toggleManageFormFieldsDialog();
      reset();
    }
  }, [isDirty, reset, toggleManageFormFieldsDialog]);

  return (
    <Dialog
      fullWidth
      open={isManageFormFieldsDialogOpen}
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
        <Typography sx={{ fontWeight: 'bolder' }}>Campos</Typography>

        <IconButton onClick={toggleAddFormFieldDialog}>
          <AddIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {form.fields.length > 0 ? (
          <List disablePadding>
            {form.fields.map((field) => (
              <ListItem key={field.id} divider>
                <ListItemIcon>{icons[field.type]}</ListItemIcon>

                <ListItemText>{field.title}</ListItemText>

                <ListItemSecondaryAction>
                  <IconButton color="warning">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <NoData message="El formulario no contiene campos" />
        )}
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
          Finalizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ManageFormFieldsDialog;
