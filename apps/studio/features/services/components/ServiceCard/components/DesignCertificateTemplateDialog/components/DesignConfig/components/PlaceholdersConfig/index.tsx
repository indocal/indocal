import {
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  AddCircle as AddIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
  RemoveCircle as RemoveIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { NoData } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../../../context';

export const PlaceholdersConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const {
    fields: placeholders,
    append,
    swap,
    remove,
  } = useFieldArray<DesignCertificateTemplateDialogData>({
    name: 'placeholders',
  });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Placeholders</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1.5} divider={<Divider flexItem />}>
          <Button
            variant="contained"
            size="small"
            disabled={isSubmitting}
            endIcon={<AddIcon />}
            onClick={() => append({ name: '' })}
          >
            Nuevo placeholder
          </Button>

          {placeholders.length > 0 ? (
            placeholders.map((placeholder, index) => (
              <Stack key={`${placeholder.name}.${index}`} spacing={1.5}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0.25}
                  sx={{ border: (th) => `1px dashed ${th.palette.divider}` }}
                >
                  <IconButton
                    size="small"
                    disabled={isSubmitting || index === 0}
                    onClick={() => swap(index, index - 1)}
                  >
                    <ArrowUpIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    disabled={isSubmitting || placeholders.length - 1 === index}
                    onClick={() => swap(index, index + 1)}
                  >
                    <ArrowDownIcon fontSize="small" />
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

                <TextField
                  fullWidth
                  autoComplete="off"
                  size="small"
                  label={`Placeholder ${index + 1}`}
                  disabled={isSubmitting}
                  inputProps={register(`placeholders.${index}.name`)}
                  error={Boolean(errors.placeholders?.[index]?.name)}
                  helperText={errors.placeholders?.[index]?.name?.message}
                />
              </Stack>
            ))
          ) : (
            <NoData message="Placeholders aún sin definir" />
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default PlaceholdersConfig;
