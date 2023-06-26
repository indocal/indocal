import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { DesignCertificateTemplateDialogData } from '../../../../context';
import { useDebounce } from '../../../../hooks';

export const StylesConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    setValue,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const [value, onChange] = useDebounce({
    initialValue: '',
    debounced: (value) => setValue('styles', value),
  });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Estilos</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <TextField
          multiline
          fullWidth
          autoComplete="off"
          placeholder="Estilos (CSS)"
          disabled={isSubmitting}
          value={value}
          onChange={onChange}
          error={Boolean(errors.styles)}
          helperText={errors.styles?.message}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default StylesConfig;
