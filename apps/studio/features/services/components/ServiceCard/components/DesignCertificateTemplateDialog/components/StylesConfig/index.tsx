import {
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { DesignCertificateTemplateDialogData } from '../../context';

export const StylesConfig: React.FC = () => {
  const {
    formState: { isSubmitting, errors },
    register,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Estilos</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2} divider={<Divider flexItem />}>
          <TextField
            fullWidth
            multiline
            size="small"
            autoComplete="off"
            label="Estilos"
            disabled={isSubmitting}
            inputProps={register('content')}
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default StylesConfig;
