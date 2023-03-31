import { useState, useMemo, useCallback } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  TextField,
} from '@mui/material';
import { TabContext, TabList, TabPanel, LoadingButton } from '@mui/lab';
import { useFormContext } from 'react-hook-form';

import { TableFormFieldColumnType } from '@indocal/services';

import { EditFormFieldDialogData } from '../../../../context';

import { useTableFormFieldConfig } from '../../context';

import {
  TextColumnConfig,
  TextAreaColumnConfig,
  NumberColumnConfig,
  DniColumnConfig,
  PhoneColumnConfig,
  EmailColumnConfig,
  CheckboxColumnConfig,
  SelectColumnConfig,
  RadioColumnConfig,
  TimeColumnConfig,
  DateColumnConfig,
  DateTimeColumnConfig,
  FilesColumnConfig,
  RatingColumnConfig,
  UsersColumnConfig,
  WebhookColumnConfig,
} from './components';

export interface EditTableFormFieldColumnDialogProps {
  column: number;
}

export const EditTableFormFieldColumnDialog: React.FC<
  EditTableFormFieldColumnDialogProps
> = ({ column }) => {
  const {
    isEditTableFormFieldColumnDialogOpen,
    toggleEditTableFormFieldColumnDialog,
  } = useTableFormFieldConfig();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    getValues,
    reset,
  } = useFormContext<EditFormFieldDialogData>();

  const enum Tabs {
    INFO = 'info',
    CONFIG = 'config',
    WEBHOOK = 'webhook',
  }

  const [tab, setTab] = useState<Tabs>(Tabs.INFO);

  const options = useMemo<Record<TableFormFieldColumnType, React.ReactElement>>(
    () => ({
      TEXT: <TextColumnConfig column={column} />,
      TEXTAREA: <TextAreaColumnConfig column={column} />,
      NUMBER: <NumberColumnConfig column={column} />,

      DNI: <DniColumnConfig column={column} />,
      PHONE: <PhoneColumnConfig column={column} />,
      EMAIL: <EmailColumnConfig column={column} />,

      CHECKBOX: <CheckboxColumnConfig column={column} />,
      SELECT: <SelectColumnConfig column={column} />,
      RADIO: <RadioColumnConfig column={column} />,

      TIME: <TimeColumnConfig column={column} />,
      DATE: <DateColumnConfig column={column} />,
      DATETIME: <DateTimeColumnConfig column={column} />,

      RATING: <RatingColumnConfig column={column} />,

      FILES: <FilesColumnConfig column={column} />,

      USERS: <UsersColumnConfig column={column} />,
    }),
    [column]
  );

  const handleOnClose = useCallback(
    async (reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick') => {
      if (!isDirty || reason === 'closeButtonClick') {
        toggleEditTableFormFieldColumnDialog();
      } else {
        const answer = window.confirm(
          '¿Estás seguro de que deseas cancelar esta acción?'
        );

        if (!answer) return;

        toggleEditTableFormFieldColumnDialog();
        reset();
      }
    },
    [isDirty, reset, toggleEditTableFormFieldColumnDialog]
  );

  return (
    <Dialog
      open={isEditTableFormFieldColumnDialogOpen}
      onClose={(_, reason) => handleOnClose(reason)}
    >
      <DialogTitle>Editar columna</DialogTitle>

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
              <Tab label="Información" value={Tabs.INFO} sx={{ width: 150 }} />

              <Tab
                label="Configuración"
                value={Tabs.CONFIG}
                sx={{ width: 150 }}
              />

              <Tab label="Webhook" value={Tabs.WEBHOOK} sx={{ width: 150 }} />
            </TabList>

            <TabPanel value={Tabs.INFO}>
              <TextField
                required
                fullWidth
                autoComplete="off"
                label="Encabezado"
                disabled={isSubmitting}
                inputProps={register(`config.columns.${column}.heading`)}
                error={
                  errors.config?.columns &&
                  errors.config.columns[column] &&
                  Boolean(errors.config.columns[column]?.heading)
                }
                helperText={
                  errors.config?.columns &&
                  errors.config.columns[column] &&
                  errors.config.columns[column]?.heading?.message
                }
              />
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>
              {options[getValues(`config.columns.${column}.type`)]}
            </TabPanel>

            <TabPanel value={Tabs.WEBHOOK}>
              <WebhookColumnConfig column={column} />
            </TabPanel>
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
          onClick={() => handleOnClose('closeButtonClick')}
        >
          Finalizar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditTableFormFieldColumnDialog;
