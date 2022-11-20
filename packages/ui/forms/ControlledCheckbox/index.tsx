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
  label: string;
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
          componentsProps={{
            badge: { style: { top: 15, right: error ? 65 : 10 } },
          }}
          sx={{ ...(error && { color: (theme) => theme.palette.error.main }) }}
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

        <FormHelperText {...formHelperTextProps}>
          {error?.message}
        </FormHelperText>
      </FormControl>
    )}
  />
);

export default ControlledCheckbox;
