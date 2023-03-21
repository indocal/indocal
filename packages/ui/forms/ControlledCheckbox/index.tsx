import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  Badge,
  FormControlProps,
  FormControlLabelProps,
  FormHelperTextProps,
  CheckboxProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledCheckboxProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formControlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
  formHelperTextProps?: FormHelperTextProps;
  checkboxProps?: Omit<CheckboxProps, 'checked' | 'onChange'>;
}

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  formControlProps,
  formControlLabelProps,
  formHelperTextProps,
  checkboxProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        <Badge
          badgeContent="*"
          invisible={!formControlProps?.required}
          slotProps={{
            badge: {
              style: label ? { top: 15, right: 10 } : { top: 10, right: 20 },
            },
          }}
          sx={{
            width: 'fit-content',
            ...(error && { color: (theme) => theme.palette.error.main }),
          }}
        >
          <FormControlLabel
            {...formControlLabelProps}
            label={label}
            control={
              <Checkbox
                {...checkboxProps}
                checked={Boolean(value)}
                onChange={(_, value) => onChange(value)}
                sx={{
                  ...(error && { color: (theme) => theme.palette.error.main }),
                  ...checkboxProps?.sx,
                }}
              />
            }
            sx={{
              ...(error && { color: (theme) => theme.palette.error.main }),
              ...formControlLabelProps?.sx,
            }}
          />
        </Badge>

        {(error?.message || description) && (
          <FormHelperText {...formHelperTextProps}>
            {error?.message || description}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
);

export default ControlledCheckbox;
