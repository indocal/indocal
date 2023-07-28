import { useState, useEffect, useMemo, useCallback, useId } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
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
  Draw as SignatureIcon,
  FilePresent as FilesIcon,
  Group as UsersIcon,
  BackupTable as SectionIcon,
  TableChart as TableIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useSWRConfig } from 'swr';

import { NoData } from '@indocal/ui';
import { Can, Form, FormFieldType, ApiEndpoints } from '@indocal/services';

import { indocal } from '@/lib';

import { useFormFieldsCard } from '../../context';
import { AddFormFieldDialog, EditFormFieldDialog } from '../../components';

export interface ManageFormFieldsDialogProps {
  form: Form;
}

export const ManageFormFieldsDialog: React.FC<ManageFormFieldsDialogProps> = ({
  form,
}) => {
  const { mutate } = useSWRConfig();

  const {
    isManageFormFieldsDialogOpen,
    isAddFormFieldDialogOpen,
    isEditFormFieldDialogOpen,
    toggleManageFormFieldsDialog,
    toggleAddFormFieldDialog,
    toggleEditFormFieldDialog,
  } = useFormFieldsCard();

  const { enqueueSnackbar } = useSnackbar();

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

      SIGNATURE: <SignatureIcon />,

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

  const droppableId = useId();

  const [sortedFields, setSortedFields] = useState<Form['fields']>(form.fields);

  useEffect(() => setSortedFields(form.fields), [form.fields]);

  const handleReorder = useCallback(
    async (result: DropResult) => {
      if (result.destination) {
        const fields = [...form.fields];
        const [removed] = fields.splice(result.source.index, 1);
        fields.splice(result.destination.index, 0, removed);

        setSortedFields(fields);

        const { form: updated, error } = await indocal.forms.reorderFields(
          form.id,
          {
            sortedFields: fields.map((field, index) => ({
              field: field.id,
              order: index + 1,
            })),
          }
        );

        if (error) {
          setSortedFields(form.fields);

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
        }
      }
    },
    [form.id, form.fields, mutate, enqueueSnackbar]
  );

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
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: (theme) => theme.spacing(1),
            }}
          >
            <Typography fontWeight="bolder">Campos</Typography>

            <Can I="create" a="formField">
              <IconButton color="inherit" onClick={toggleAddFormFieldDialog}>
                <AddIcon />
              </IconButton>
            </Can>
          </Toolbar>
        </AppBar>

        <DialogContent dividers>
          {sortedFields.length > 0 ? (
            <DragDropContext onDragEnd={handleReorder}>
              <Droppable droppableId={droppableId}>
                {(provided) => (
                  <List
                    disablePadding
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {sortedFields.map((field, index) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(provided) => (
                          <ListItem
                            divider
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItemIcon>{icons[field.type]}</ListItemIcon>

                            <ListItemText>{field.title}</ListItemText>

                            <Can I="update" a="formField">
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleEdit(field)}
                                >
                                  <SettingsIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </Can>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
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
