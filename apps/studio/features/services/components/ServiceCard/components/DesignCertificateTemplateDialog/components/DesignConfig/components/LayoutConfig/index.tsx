import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';
import { CertificateTemplateLayoutOrientation } from '@indocal/services';

import { DesignCertificateTemplateDialogData } from '../../../../context';

export const LayoutConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Diseño</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack>
          <ControlledRadioGroup
            name="layout.orientation"
            label="Orientación"
            control={control as unknown as Control}
            formControlProps={{
              required: true,
              disabled: isSubmitting,
            }}
            formHelperTextProps={{
              sx: {
                marginX: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              },
            }}
            radioGroupProps={{ row: true }}
          >
            <FormControlLabel
              value={CertificateTemplateLayoutOrientation.PORTRAIT}
              label="Vertical"
              control={<Radio />}
            />

            <FormControlLabel
              value={CertificateTemplateLayoutOrientation.LANDSCAPE}
              label="Horizontal"
              control={<Radio />}
            />
          </ControlledRadioGroup>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default LayoutConfig;
