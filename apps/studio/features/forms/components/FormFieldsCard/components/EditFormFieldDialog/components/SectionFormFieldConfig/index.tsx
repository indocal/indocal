import { useState, useCallback } from 'react';
import {
  Stack,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import {
  AddCircle as AddIcon,
  Settings as SettingsIcon,
  RemoveCircle as RemoveIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, Control } from 'react-hook-form';

import { NoData, ControlledCheckbox } from '@indocal/ui';
import { generateUUID } from '@indocal/utils';

import { EditFormFieldDialogData } from '../../context';

import {
  SectionFormFieldConfigProvider,
  useSectionFormFieldConfig,
} from './context';
import {
  EditSectionFormFieldItemDialog,
  ControlledItemTypeSelect,
} from './components';

const SectionFormFieldConfig: React.FC = () => {
  const {
    isEditSectionFormFieldItemDialogOpen,
    toggleEditSectionFormFieldItemDialog,
  } = useSectionFormFieldConfig();

  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const {
    fields: items,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: 'config.items',
  });

  const [item, setItem] = useState<number | null>(null);

  const handleEdit = useCallback(
    (item: number) => {
      setItem(item);
      toggleEditSectionFormFieldItemDialog();
    },
    [toggleEditSectionFormFieldItemDialog]
  );

  return (
    <>
      {isEditSectionFormFieldItemDialogOpen && typeof item === 'number' && (
        <EditSectionFormFieldItemDialog item={item} />
      )}

      <Stack spacing={2} divider={<Divider flexItem />}>
        <ControlledCheckbox
          name="config.required"
          label="¿Campo requerido?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <List
          sx={{
            borderRadius: (theme) => theme.shape.borderRadius,
            backgroundColor: (theme) => theme.palette.background.paper,
            ...(errors.config?.items && {
              border: (theme) => `1px solid ${theme.palette.error.main}`,
            }),
          }}
        >
          <ListSubheader
            disableSticky
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(1.5, 2),
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" fontWeight="bolder">
              Campos
            </Typography>

            <IconButton
              size="small"
              disabled={isSubmitting}
              onClick={() => append({ id: generateUUID(), type: 'TEXT' })}
            >
              <AddIcon />
            </IconButton>
          </ListSubheader>

          {items.length > 0 ? (
            items.map((item, index) => (
              <ListItem key={item.id} divider>
                <ListItemIcon
                  sx={{
                    gap: (theme) => theme.spacing(0.5),
                    paddingRight: (theme) => theme.spacing(2.5),
                  }}
                >
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={isSubmitting || index === 0}
                    onClick={() => swap(index, index - 1)}
                  >
                    <ArrowUpIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    edge="start"
                    size="small"
                    disabled={isSubmitting || items.length - 1 === index}
                    onClick={() => swap(index, index + 1)}
                  >
                    <ArrowDownIcon fontSize="small" />
                  </IconButton>
                </ListItemIcon>

                <Stack
                  spacing={2}
                  sx={{
                    width: '100%',
                    marginY: (theme) => theme.spacing(1),

                    ...(errors?.config?.items &&
                      errors.config.items[index] && {
                        padding: (theme) => theme.spacing(2),
                        border: (theme) =>
                          `1px dashed ${theme.palette.error.main}`,
                      }),
                  }}
                >
                  <ControlledItemTypeSelect
                    required
                    name={`config.items.${index}.type`}
                    label={`Tipo (Campo ${index + 1})`}
                    control={control as unknown as Control}
                    disabled={isSubmitting}
                    formControlProps={{ size: 'small' }}
                  />

                  <TextField
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    autoComplete="off"
                    label={`Título (Campo ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`config.items.${index}.title`)}
                    error={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      Boolean(errors.config.items[index]?.title)
                    }
                    helperText={
                      errors.config?.items &&
                      errors.config.items[index] &&
                      errors.config.items[index]?.title?.message
                    }
                  />
                </Stack>

                <ListItemSecondaryAction>
                  <Stack spacing={1}>
                    <IconButton
                      size="small"
                      disabled={isSubmitting}
                      onClick={() => handleEdit(index)}
                    >
                      <SettingsIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      disabled={isSubmitting}
                      onClick={() => remove(index)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <NoData message="Debe definir al menos un campo" />
          )}
        </List>
      </Stack>
    </>
  );
};

const SectionFormFieldConfigWrapper: React.FC = () => (
  <SectionFormFieldConfigProvider>
    <SectionFormFieldConfig />
  </SectionFormFieldConfigProvider>
);

export { SectionFormFieldConfigWrapper as SectionFormFieldConfig };

export default SectionFormFieldConfigWrapper;
