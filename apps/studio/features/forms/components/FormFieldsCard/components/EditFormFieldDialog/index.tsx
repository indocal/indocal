import { useState, useMemo, useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { TabContext, TabList, TabPanel, LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import {
  Form,
  FormField,
  FormFieldType,
  ApiEndpoints,
} from '@indocal/services';

import { indocal } from '@/lib';

import { useFormFieldsCard } from '../../context';

import {
  EditFormFieldDialogProvider,
  EditFormFieldDialogData,
} from './context';
import {
  TextFormFieldConfig,
  TextAreaFormFieldConfig,
  NumberFormFieldConfig,
  DniFormFieldConfig,
  PhoneFormFieldConfig,
  EmailFormFieldConfig,
  CheckboxFormFieldConfig,
  SelectFormFieldConfig,
  RadioFormFieldConfig,
  TimeFormFieldConfig,
  DateFormFieldConfig,
  DateTimeFormFieldConfig,
  UsersFormFieldConfig,
  TableFormFieldConfig,
  // ApiFormFieldConfig, {/* TODO: implement API feature */}
} from './components';

export interface EditFormFieldDialogProps {
  form: Form;
  field: FormField;
}

const EditFormFieldDialog: React.FC<EditFormFieldDialogProps> = ({
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
  } = useFormContext<EditFormFieldDialogData>();

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
    API = 'api',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const options = useMemo<Record<FormFieldType, React.ReactElement>>(
    () => ({
      TEXT: <TextFormFieldConfig />,
      TEXTAREA: <TextAreaFormFieldConfig />,
      NUMBER: <NumberFormFieldConfig />,

      DNI: <DniFormFieldConfig />,
      PHONE: <PhoneFormFieldConfig />,
      EMAIL: <EmailFormFieldConfig />,

      CHECKBOX: <CheckboxFormFieldConfig />,
      SELECT: <SelectFormFieldConfig />,
      RADIO: <RadioFormFieldConfig />,

      TIME: <TimeFormFieldConfig />,
      DATE: <DateFormFieldConfig />,
      DATETIME: <DateTimeFormFieldConfig />,

      USERS: <UsersFormFieldConfig />,

      TABLE: <TableFormFieldConfig />,
    }),
    []
  );

  const onSubmit = useCallback(
    async (formData: EditFormFieldDialogData) => {
      const { error } = await indocal.forms.fields.update(field.id, {
        title: formData.title,
        description: formData.description || null,
        config: formData.config,
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

  const handleDelete = useCallback(async () => {
    const answer = window.confirm(
      '¿Estás seguro de que deseas eliminar este campo?'
    );

    if (!answer) return;

    const { error } = await indocal.forms.fields.delete(field.id);

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

      enqueueSnackbar('Campo eliminado exitosamente', {
        variant: 'success',
        onEntered: toggleEditFormFieldDialog,
      });
    }
  }, [form.id, field.id, mutate, toggleEditFormFieldDialog, enqueueSnackbar]);

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
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: (theme) => theme.spacing(1),
        }}
      >
        <Typography fontWeight="bolder">Editar campo</Typography>

        <IconButton color="error" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ padding: 0 }}>
        <Stack component="form" autoComplete="off">
          <TabContext value={tab}>
            <TabList
              variant="fullWidth"
              onChange={(_, value) => setTab(value)}
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
              }}
            >
              <Tab label="Información" value={Tabs.INFO} />
              <Tab label="Configuración" value={Tabs.CONFIG} />
              {/* TODO: implement API feature */}
              {/* <Tab label="API" value={Tabs.API} /> */}
            </TabList>

            <TabPanel value={Tabs.INFO}>
              <Stack spacing={2}>
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
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>{options[field.type]}</TabPanel>

            {/* TODO: implement API feature */}
            {/* <TabPanel value={Tabs.API}>
              <ApiFormFieldConfig />
            </TabPanel> */}
          </TabContext>
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

const EditFormFieldDialogWrapper: React.FC<EditFormFieldDialogProps> = ({
  form,
  field,
}) => (
  <EditFormFieldDialogProvider field={field}>
    <EditFormFieldDialog form={form} field={field} />
  </EditFormFieldDialogProvider>
);

export { EditFormFieldDialogWrapper as EditFormFieldDialog };

export default EditFormFieldDialogWrapper;
