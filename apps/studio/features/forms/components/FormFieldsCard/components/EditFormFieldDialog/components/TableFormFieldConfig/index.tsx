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
  RemoveCircle as RemoveIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, Control } from 'react-hook-form';

import { NoData, ControlledCheckbox } from '@indocal/ui';

import { ControlledFormFieldTypeSelect } from '@/features';

import { EditFormFieldDialogData } from '../../context';

export const TableFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const { fields, append, swap, remove } = useFieldArray({
    name: 'config.columns',
  });

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <ControlledCheckbox
        name="config.required"
        label="¿Campo requerido?"
        control={control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <List
        sx={{
          borderRadius: (theme) => theme.shape.borderRadius,
          backgroundColor: (theme) => theme.palette.background.paper,
          ...(fields.length === 0 && {
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
            Columnas
          </Typography>

          <IconButton size="small" onClick={() => append({ type: 'TEXT' })}>
            <AddIcon />
          </IconButton>
        </ListSubheader>

        {fields.length > 0 ? (
          fields.map((field, index) => (
            <ListItem key={field.id} divider>
              <ListItemIcon
                sx={{
                  gap: (theme) => theme.spacing(0.5),
                  paddingRight: (theme) => theme.spacing(2.5),
                }}
              >
                <IconButton
                  edge="end"
                  size="small"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                >
                  <ArrowUpIcon fontSize="small" />
                </IconButton>

                <IconButton
                  edge="start"
                  size="small"
                  disabled={fields.length - 1 === index}
                  onClick={() => swap(index, index + 1)}
                >
                  <ArrowDownIcon fontSize="small" />
                </IconButton>
              </ListItemIcon>

              <Stack
                spacing={2}
                sx={{ width: '100%', marginY: (theme) => theme.spacing(1) }}
              >
                <ControlledFormFieldTypeSelect
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
                    Boolean(errors.config.columns[index])
                  }
                  helperText={
                    errors.config?.columns &&
                    errors.config.columns[index] &&
                    errors.config.columns[index]?.heading?.message
                  }
                />
              </Stack>

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  color="error"
                  onClick={() => remove(index)}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <NoData message="Debe definir al menos una columna" />
        )}
      </List>
    </Stack>
  );
};

export default TableFormFieldConfig;
