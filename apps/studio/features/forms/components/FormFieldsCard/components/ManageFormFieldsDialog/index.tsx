import { useState, useMemo, useCallback } from 'react';
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
  Settings as SettingsIcon,
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
  Event as DateIcon,
  EventNote as DateTimeIcon,
  Star as RatingIcon,
  SentimentSatisfied as NetPromoterScoreIcon,
  FilePresent as FilesIcon,
  Group as UsersIcon,
  BackupTable as SectionIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { NoData } from '@indocal/ui';
import { Can, Form, FormFieldType } from '@indocal/services';

import { useFormFieldsCard } from '../../context';
import { AddFormFieldDialog, EditFormFieldDialog } from '../../components';

export interface ManageFormFieldsDialogProps {
  form: Form;
}

export const ManageFormFieldsDialog: React.FC<ManageFormFieldsDialogProps> = ({
  form,
}) => {
  const {
    isManageFormFieldsDialogOpen,
    isAddFormFieldDialogOpen,
    isEditFormFieldDialogOpen,
    toggleManageFormFieldsDialog,
    toggleAddFormFieldDialog,
    toggleEditFormFieldDialog,
  } = useFormFieldsCard();

  const [field, setField] = useState<Form['fields'][number] | null>(null);

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

      RATING: <RatingIcon />,
      NET_PROMOTER_SCORE: <NetPromoterScoreIcon />,

      FILES: <FilesIcon />,

      USERS: <UsersIcon />,

      SECTION: <SectionIcon />,
      TABLE: <TableIcon />,
    }),
    []
  );

  const handleEdit = useCallback(
    (field: Form['fields'][number]) => {
      setField(field);
      toggleEditFormFieldDialog();
    },
    [toggleEditFormFieldDialog]
  );

  const handleOnClose = useCallback(() => {
    setField(null);
    toggleManageFormFieldsDialog();
  }, [toggleManageFormFieldsDialog]);

  return (
    <>
      {isAddFormFieldDialogOpen && <AddFormFieldDialog form={form} />}

      {isEditFormFieldDialogOpen && field && (
        <EditFormFieldDialog form={form} field={field} />
      )}

      <Dialog
        fullScreen
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
          <Typography fontWeight="bolder">Campos</Typography>

          <Can I="create" a="formField">
            <IconButton onClick={toggleAddFormFieldDialog}>
              <AddIcon />
            </IconButton>
          </Can>
        </DialogTitle>

        <DialogContent dividers>
          {form.fields.length > 0 ? (
            <List disablePadding>
              {form.fields.map((field) => (
                <ListItem key={field.id} divider>
                  <ListItemIcon>{icons[field.type]}</ListItemIcon>

                  <ListItemText>{field.title}</ListItemText>

                  <Can I="update" a="formField">
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEdit(field)}>
                        <SettingsIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Can>
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
            onClick={toggleManageFormFieldsDialog}
          >
            Finalizar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageFormFieldsDialog;
