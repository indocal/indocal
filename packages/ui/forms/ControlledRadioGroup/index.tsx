import {
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlProps,
  FormHelperTextProps,
  FormLabelProps,
  RadioGroupProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledRadioGroupProps {
  name: string;
  label: string;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formLabelProps?: FormLabelProps;
  formHelperTextProps?: FormHelperTextProps;
  radioGroupProps?: Omit<RadioGroupProps, 'value' | 'onChange'>;
}

export const ControlledRadioGroup: React.FC<
  React.PropsWithChildren<ControlledRadioGroupProps>
> = ({
  name,
  label,
  control,
  controllerProps,
  formControlProps,
  formLabelProps,
  formHelperTextProps,
  radioGroupProps,
  children,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        <FormLabel {...formLabelProps}>{label}</FormLabel>

        <RadioGroup
          {...radioGroupProps}
          value={value ?? null}
          onChange={(_, value) => onChange(value)}
        >
          {children}
        </RadioGroup>

        <FormHelperText {...formHelperTextProps}>
          {error?.message}
        </FormHelperText>
      </FormControl>
    )}
  />
);

export default ControlledRadioGroup;