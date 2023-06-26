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

export const ContentConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    setValue,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  const [value, onChange] = useDebounce({
    initialValue: '',
    debounced: (value) => setValue('content', value),
  });

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Contenido</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <TextField
          multiline
          fullWidth
          autoComplete="off"
          placeholder="Contenido (HTML & CSS)"
          disabled={isSubmitting}
          value={value}
          onChange={onChange}
          error={Boolean(errors.content)}
          helperText={errors.content?.message}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ContentConfig;
