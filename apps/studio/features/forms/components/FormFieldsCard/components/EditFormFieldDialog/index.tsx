import { useState, useMemo, useCallback } from 'react';
import {
  Stack,
  Divider,
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
import { useConfirm } from 'material-ui-confirm';
import { useSWRConfig } from 'swr';
import { useFormContext } from 'react-hook-form';

import { Form, FormFieldType, ApiEndpoints } from '@indocal/services';

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
  RatingFormFieldConfig,
  NetPromoterScoreFormFieldConfig,
  SignatureFormFieldConfig,
  FilesFormFieldConfig,
  UsersFormFieldConfig,
  SectionFormFieldConfig,
  TableFormFieldConfig,
  FormFieldHintConfig,
} from './components';

export interface EditFormFieldDialogProps {
  form: Form;
  field: Form['fields'][number];
}

const EditFormFieldDialog: React.FC<EditFormFieldDialogProps> = ({
  form,
  field,
}) => {
  const { mutate } = useSWRConfig();

  const { isEditFormFieldDialogOpen, toggleEditFormFieldDialog } =
    useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useFormContext<EditFormFieldDialogData>();

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
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

      RATING: <RatingFormFieldConfig />,
      NET_PROMOTER_SCORE: <NetPromoterScoreFormFieldConfig />,

      SIGNATURE: <SignatureFormFieldConfig />,

      FILES: <FilesFormFieldConfig />,

      USERS: <UsersFormFieldConfig />,

      SECTION: <SectionFormFieldConfig />,
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

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Eliminar campo',
      description: '¿Estás seguro de que deseas eliminar este campo?',
    }).then(async () => {
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
    });
  }, [
    form.id,
    field.id,
    mutate,
    toggleEditFormFieldDialog,
    enqueueSnackbar,
    confirm,
  ]);

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      toggleEditFormFieldDialog();
    } else {
      confirm({
        title: 'Cancelar acción',
        description: '¿Estás seguro de que deseas cancelar esta acción?',
      })
        .then(() => {
          toggleEditFormFieldDialog();
          reset();
        })
        .catch(() => undefined);
    }
  }, [isDirty, reset, toggleEditFormFieldDialog, confirm]);

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
            </TabList>

            <TabPanel value={Tabs.INFO}>
              <Stack spacing={2} divider={<Divider flexItem />}>
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

                <FormFieldHintConfig />
              </Stack>
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>{options[field.type]}</TabPanel>
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
