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
import { useFormContext, useFieldArray } from 'react-hook-form';

import { NoData, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../context';

export const RadioFormFieldConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const { fields, append, swap, remove } = useFieldArray({
    name: 'config.options',
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
            Opciones
          </Typography>

          <IconButton size="small" onClick={() => append(undefined)}>
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

              <TextField
                required
                fullWidth
                size="small"
                margin="dense"
                autoComplete="off"
                label={`Opción ${index + 1}`}
                disabled={isSubmitting}
                inputProps={register(`config.options.${index}`)}
                error={
                  errors.config?.options &&
                  Boolean(errors.config.options[index])
                }
                helperText={
                  errors.config?.options &&
                  errors.config.options[index]?.message
                }
              />

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
          <NoData message="Debe ingresar al menos una opción" />
        )}
      </List>
    </Stack>
  );
};

export default RadioFormFieldConfig;