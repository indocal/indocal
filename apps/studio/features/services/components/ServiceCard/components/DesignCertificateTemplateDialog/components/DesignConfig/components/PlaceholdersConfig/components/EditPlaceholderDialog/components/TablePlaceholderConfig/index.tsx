import {
  Stack,
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

import { NoData } from '@indocal/ui';

import { EditPlaceholderDialogData } from '../../context';

import { ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelect } from './components';

export const TablePlaceholderConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
    control,
  } = useFormContext<EditPlaceholderDialogData>();

  const {
    fields: columns,
    append,
    swap,
    remove,
  } = useFieldArray({
    name: 'config.columns',
  });

  return (
    <List
      sx={{
        borderRadius: (theme) => theme.shape.borderRadius,
        backgroundColor: (theme) => theme.palette.background.paper,
        ...(errors.config?.columns && {
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

        <IconButton
          size="small"
          disabled={isSubmitting}
          onClick={() => append({ type: 'TEXT' })}
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
                    border: (theme) => `1px dashed ${theme.palette.error.main}`,
                  }),
              }}
            >
              <ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelect
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
                label={`Nombre (Columna ${index + 1})`}
                disabled={isSubmitting}
                inputProps={register(`config.columns.${index}.name`)}
                error={
                  errors.config?.columns &&
                  errors.config.columns[index] &&
                  Boolean(errors.config.columns[index]?.name)
                }
                helperText={
                  errors.config?.columns &&
                  errors.config.columns[index] &&
                  errors.config.columns[index]?.name?.message
                }
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
              <IconButton
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
        <NoData message="Debe definir al menos una columna" />
      )}
    </List>
  );
};

export default TablePlaceholderConfig;
