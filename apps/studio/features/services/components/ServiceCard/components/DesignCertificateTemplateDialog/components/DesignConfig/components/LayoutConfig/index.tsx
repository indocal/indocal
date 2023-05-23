import {
  Stack,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { useFormContext, Control } from 'react-hook-form';

import { ControlledRadioGroup } from '@indocal/ui';

import { DesignCertificateTemplateDialogData } from '../../../../context';
import { STANDARD_PAGE_SIZES } from '../../../../config';

export const LayoutConfig: React.FC = () => {
  const {
    formState: { isSubmitting },
    control,
  } = useFormContext<DesignCertificateTemplateDialogData>();

  return (
    <Stack
      component="fieldset"
      sx={{
        margin: 0,
        paddingX: (theme) => theme.spacing(2),
        borderRadius: (theme) => theme.spacing(0.5),
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Typography
        component="legend"
        variant="subtitle2"
        sx={{ paddingX: (theme) => theme.spacing(1) }}
      >
        Disposición
      </Typography>

      <Stack
        spacing={2}
        divider={<Divider flexItem />}
        sx={{ padding: (theme) => theme.spacing(1, 0.25) }}
      >
        <ControlledRadioGroup
          name="layout.orientation"
          label="Orientación"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
          radioGroupProps={{ row: true }}
        >
          <FormControlLabel
            value="portrait"
            label="Vertical"
            control={<Radio />}
          />

          <FormControlLabel
            value="landscape"
            label="Horizontal"
            control={<Radio />}
          />
        </ControlledRadioGroup>

        <ControlledRadioGroup
          name="layout.size"
          label="Tamaño de página"
          control={control as unknown as Control}
          formControlProps={{ disabled: isSubmitting }}
          radioGroupProps={{ row: true }}
        >
          {STANDARD_PAGE_SIZES.map((pageSize) => (
            <FormControlLabel
              key={pageSize}
              value={pageSize}
              label={pageSize}
              control={<Radio />}
            />
          ))}
        </ControlledRadioGroup>
      </Stack>
    </Stack>
  );
};

export default LayoutConfig;
