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

import { NoData, NumberField, ControlledCheckbox } from '@indocal/ui';
import { generateUUID } from '@indocal/utils';

import { EditFormFieldDialogData } from '../../context';

import {
  TableFormFieldConfigProvider,
  useTableFormFieldConfig,
} from './context';
import {
  EditTableFormFieldColumnDialog,
  ControlledColumnTypeSelect,
} from './components';

const TableFormFieldConfig: React.FC = () => {
  const {
    isEditTableFormFieldColumnDialogOpen,
    toggleEditTableFormFieldColumnDialog,
  } = useTableFormFieldConfig();

  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const {
    fields: columns,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: 'config.columns',
  });

  const [column, setColumn] = useState<number | null>(null);

  const handleEdit = useCallback(
    (column: number) => {
      setColumn(column);
      toggleEditTableFormFieldColumnDialog();
    },
    [toggleEditTableFormFieldColumnDialog]
  );

  return (
    <>
      {isEditTableFormFieldColumnDialogOpen && typeof column === 'number' && (
        <EditTableFormFieldColumnDialog column={column} />
      )}

      <Stack spacing={2} divider={<Divider flexItem />}>
        <ControlledCheckbox
          name="config.required"
          label="¿Campo requerido?"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
        />

        <Stack direction="row" spacing={2}>
          <NumberField
            fullWidth
            size="small"
            autoComplete="off"
            label="Filas mínimas"
            disabled={isSubmitting}
            inputProps={register('config.minRows', { valueAsNumber: true })}
            error={Boolean(errors.config?.minRows)}
            helperText={errors.config?.minRows?.message}
          />

          <NumberField
            fullWidth
            size="small"
            autoComplete="off"
            label="Filas máximas"
            disabled={isSubmitting}
            inputProps={register('config.maxRows', { valueAsNumber: true })}
            error={Boolean(errors.config?.maxRows)}
            helperText={errors.config?.maxRows?.message}
          />
        </Stack>

        <List
          disablePadding
          sx={{
            position: 'relative',
            maxHeight: 300,
            borderRadius: 1,
            backgroundColor: (theme) => theme.palette.background.paper,
            overflow: 'auto',
            ...(errors.config?.columns && {
              border: (theme) => `1px solid ${theme.palette.error.main}`,
            }),
          }}
        >
          <ListSubheader
            sx={{
              zIndex: (theme) => theme.zIndex.tooltip,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(1, 2),
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" fontWeight="bolder">
              Columnas
            </Typography>

            <IconButton
              size="small"
              disabled={isSubmitting}
              onClick={() => append({ id: generateUUID(), type: 'TEXT' })}
            >
              <AddIcon />
            </IconButton>
          </ListSubheader>

          {columns.length > 0 ? (
            columns.map((column, index) => (
              <ListItem key={column.id} divider>
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
                    disabled={isSubmitting || columns.length - 1 === index}
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

                    ...(errors?.config?.columns &&
                      errors.config.columns[index] && {
                        padding: (theme) => theme.spacing(2),
                        border: (theme) =>
                          `1px dashed ${theme.palette.error.main}`,
                      }),
                  }}
                >
                  <ControlledColumnTypeSelect
                    required
                    name={`config.columns.${index}.type`}
                    label={`Tipo (Columna ${index + 1})`}
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
                    label={`Encabezado (Columna ${index + 1})`}
                    disabled={isSubmitting}
                    inputProps={register(`config.columns.${index}.heading`)}
                    error={
                      errors.config?.columns &&
                      errors.config.columns[index] &&
                      Boolean(errors.config.columns[index]?.heading)
                    }
                    helperText={
                      errors.config?.columns &&
                      errors.config.columns[index] &&
                      errors.config.columns[index]?.heading?.message
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
            <NoData message="Debe definir al menos una columna" />
          )}
        </List>
      </Stack>
    </>
  );
};

const TableFormFieldConfigWrapper: React.FC = () => (
  <TableFormFieldConfigProvider>
    <TableFormFieldConfig />
  </TableFormFieldConfigProvider>
);

export { TableFormFieldConfigWrapper as TableFormFieldConfig };

export default TableFormFieldConfigWrapper;
