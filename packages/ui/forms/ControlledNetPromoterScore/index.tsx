import {
  FormControl,
  FormLabel,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  FormControlProps,
  FormLabelProps,
  FormHelperTextProps,
  ToggleButtonGroupProps,
  ToggleButtonProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledNetPromoterScoreProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formLabelProps?: FormLabelProps;
  formHelperTextProps?: FormHelperTextProps;
  toggleButtonGroupProps?: Omit<
    ToggleButtonGroupProps,
    'exclusive' | 'value' | 'onChange'
  >;
  toggleButtonProps?: Omit<ToggleButtonProps, 'key' | 'value'>;
}

export const ControlledNetPromoterScore: React.FC<
  ControlledNetPromoterScoreProps
> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  formControlProps,
  formLabelProps,
  formHelperTextProps,
  toggleButtonGroupProps,
  toggleButtonProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}

        <ToggleButtonGroup
          {...toggleButtonGroupProps}
          exclusive
          value={value ?? null}
          onChange={(_, value) => onChange(value)}
          sx={{
            gap: (theme) => theme.spacing(1),
            marginY: (theme) => theme.spacing(1),
            ...toggleButtonGroupProps?.sx,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
            <ToggleButton
              {...toggleButtonProps}
              key={option}
              value={option}
              sx={{
                width: 50,
                border: (theme) =>
                  `1px solid ${theme.palette.divider} !important`,
                ...toggleButtonProps?.sx,
              }}
            >
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {(error?.message || description) && (
          <FormHelperText {...formHelperTextProps}>
            {error?.message || description}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
);

export default ControlledNetPromoterScore;
