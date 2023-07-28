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
import { useConfirm } from 'material-ui-confirm';
import { useFormContext } from 'react-hook-form';

import { SectionFormFieldItemType } from '@indocal/services';

import { EditFormFieldDialogData } from '../../../../context';

import { useSectionFormFieldConfig } from '../../context';

import {
  TextItemConfig,
  TextAreaItemConfig,
  NumberItemConfig,
  DniItemConfig,
  PhoneItemConfig,
  EmailItemConfig,
  CheckboxItemConfig,
  SelectItemConfig,
  RadioItemConfig,
  TimeItemConfig,
  DateItemConfig,
  DateTimeItemConfig,
  RatingItemConfig,
  NetPromoterScoreItemConfig,
  SignatureItemConfig,
  FilesItemConfig,
  UsersItemConfig,
  WebhookItemConfig,
} from './components';

export interface EditSectionFormFieldItemDialogProps {
  item: number;
}

export const EditSectionFormFieldItemDialog: React.FC<
  EditSectionFormFieldItemDialogProps
> = ({ item }) => {
  const {
    isEditSectionFormFieldItemDialogOpen,
    toggleEditSectionFormFieldItemDialog,
  } = useSectionFormFieldConfig();

  const confirm = useConfirm();

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

  const options = useMemo<Record<SectionFormFieldItemType, React.ReactElement>>(
    () => ({
      TEXT: <TextItemConfig item={item} />,
      TEXTAREA: <TextAreaItemConfig item={item} />,
      NUMBER: <NumberItemConfig item={item} />,

      DNI: <DniItemConfig item={item} />,
      PHONE: <PhoneItemConfig item={item} />,
      EMAIL: <EmailItemConfig item={item} />,

      CHECKBOX: <CheckboxItemConfig item={item} />,
      SELECT: <SelectItemConfig item={item} />,
      RADIO: <RadioItemConfig item={item} />,

      TIME: <TimeItemConfig item={item} />,
      DATE: <DateItemConfig item={item} />,
      DATETIME: <DateTimeItemConfig item={item} />,

      RATING: <RatingItemConfig item={item} />,
      NET_PROMOTER_SCORE: <NetPromoterScoreItemConfig item={item} />,

      SIGNATURE: <SignatureItemConfig item={item} />,

      FILES: <FilesItemConfig item={item} />,

      USERS: <UsersItemConfig item={item} />,
    }),
    [item]
  );

  const handleOnClose = useCallback(
    (reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick') => {
      if (!isDirty || reason === 'closeButtonClick') {
        toggleEditSectionFormFieldItemDialog();
      } else {
        confirm({
          title: 'Cancelar acción',
          description: '¿Estás seguro de que deseas cancelar esta acción?',
        })
          .then(() => {
            toggleEditSectionFormFieldItemDialog();
            reset();
          })
          .catch(() => undefined);
      }
    },
    [isDirty, reset, toggleEditSectionFormFieldItemDialog, confirm]
  );

  return (
    <Dialog
      open={isEditSectionFormFieldItemDialogOpen}
      onClose={(_, reason) => handleOnClose(reason)}
    >
      <DialogTitle>Editar campo</DialogTitle>

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
              <Stack spacing={2}>
                <TextField
                  required
                  autoComplete="off"
                  label="Título"
                  disabled={isSubmitting}
                  inputProps={register(`config.items.${item}.title`)}
                  error={
                    errors.config?.items &&
                    errors.config.items[item] &&
                    Boolean(errors.config.items[item]?.title)
                  }
                  helperText={
                    errors.config?.items &&
                    errors.config.items[item] &&
                    errors.config.items[item]?.title?.message
                  }
                />

                <TextField
                  multiline
                  autoComplete="off"
                  label="Descripción"
                  disabled={isSubmitting}
                  inputProps={register(`config.items.${item}.description`)}
                  error={
                    errors.config?.items &&
                    errors.config.items[item] &&
                    Boolean(errors.config.items[item]?.description)
                  }
                  helperText={
                    errors.config?.items &&
                    errors.config.items[item] &&
                    errors.config.items[item]?.description?.message
                  }
                />
              </Stack>
            </TabPanel>

            <TabPanel value={Tabs.CONFIG}>
              {options[getValues(`config.items.${item}.type`)]}
            </TabPanel>

            <TabPanel value={Tabs.WEBHOOK}>
              <WebhookItemConfig item={item} />
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

export default EditSectionFormFieldItemDialog;
