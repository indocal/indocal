import {
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListSubheader,
  ListItem,
  ListItemSecondaryAction,
  ListItemIcon,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { NoData } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../context';

export const VariablesConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const {
    fields: variables,
    append,
    swap,
    remove,
  } = useFieldArray({ name: 'variables' });

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Variables</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <List
            sx={{
              borderRadius: (theme) => theme.shape.borderRadius,
              backgroundColor: (theme) => theme.palette.background.paper,
              ...(errors.variables && {
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
                Variables
              </Typography>

              <IconButton
                size="small"
                disabled={isSubmitting}
                onClick={() => append(undefined)}
              >
                <AddIcon />
              </IconButton>
            </ListSubheader>

            {variables.length > 0 ? (
              variables.map((variable, index) => (
                <ListItem key={`${variable}-${index}`} divider>
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
                      disabled={isSubmitting || variables.length - 1 === index}
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
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      size="small"
                      margin="dense"
                      autoComplete="off"
                      label={`Nombre (Variable ${index + 1})`}
                      disabled={isSubmitting}
                      inputProps={register(`variables.${index}`)}
                      error={
                        errors.variables &&
                        errors.variables[index] &&
                        Boolean(errors.variables[index])
                      }
                      helperText={
                        errors.variables &&
                        errors.variables[index] &&
                        errors.variables[index]?.message
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
              <NoData message="No hay variables definidas" />
            )}
          </List>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default VariablesConfig;
