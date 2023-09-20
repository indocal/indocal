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
import {
  useFormContext,
  useFieldArray,
  Control,
  FieldErrors,
} from 'react-hook-form';

import { NoData, ControlledCheckbox } from '@indocal/ui';

import { EditFormFieldDialogData } from '../../../../../../context';

export interface RadioColumnConfigProps {
  column: number;
}

export const RadioColumnConfig: React.FC<RadioColumnConfigProps> = ({
  column,
}) => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditFormFieldDialogData>();

  const {
    fields: options,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: `config.columns.${column}.config.options`,
  });

  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      <ControlledCheckbox
        name={`config.columns.${column}.config.required`}
        label="¿Campo requerido?"
        control={control as unknown as Control}
        formControlProps={{ disabled: isSubmitting }}
      />

      <List
        disablePadding
        sx={{
          position: 'relative',
          maxHeight: 300,
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.paper,
          overflow: 'auto',
          ...(errors.config?.columns &&
            errors.config.columns[column]?.config?.options && {
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
            Opciones
          </Typography>

          <IconButton
            size="small"
            disabled={isSubmitting}
            onClick={() => append(undefined)}
          >
            <AddIcon />
          </IconButton>
        </ListSubheader>

        {options.length > 0 ? (
          options.map((option, index) => (
            <ListItem key={option.id} divider>
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
                  disabled={isSubmitting || options.length - 1 === index}
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
                inputProps={register(
                  `config.columns.${column}.config.options.${index}`
                )}
                error={Boolean(
                  errors.config &&
                    errors.config?.columns &&
                    errors.config?.columns[column] &&
                    errors.config?.columns[column]?.config &&
                    errors.config?.columns[column]?.config?.options &&
                    ((
                      errors.config?.columns[column]?.config
                        ?.options as FieldErrors
                    )[index]?.message as string)
                )}
                helperText={
                  errors.config &&
                  errors.config?.columns &&
                  errors.config?.columns[column] &&
                  errors.config?.columns[column]?.config &&
                  errors.config?.columns[column]?.config?.options &&
                  ((
                    errors.config?.columns[column]?.config
                      ?.options as FieldErrors
                  )[index]?.message as string)
                }
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  color="error"
                  disabled={isSubmitting}
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

export default RadioColumnConfig;
