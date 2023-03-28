import {
  FormControl,
  FormLabel,
  FormHelperText,
  Rating,
  FormControlProps,
  FormLabelProps,
  FormHelperTextProps,
  RatingProps,
} from '@mui/material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

export interface ControlledRatingProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formLabelProps?: FormLabelProps;
  formHelperTextProps?: FormHelperTextProps;
  ratingProps?: Omit<RatingProps, 'value' | 'onChange'>;
}

export const ControlledRating: React.FC<ControlledRatingProps> = ({
  name,
  label,
  description,
  control,
  controllerProps,
  formControlProps,
  formLabelProps,
  formHelperTextProps,
  ratingProps,
}) => (
  <Controller
    {...controllerProps}
    name={name}
    control={control}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl {...formControlProps} error={Boolean(error)}>
        {label && <FormLabel {...formLabelProps}>{label}</FormLabel>}

        <Rating
          {...ratingProps}
          value={value ?? null}
          onChange={(_, value) => onChange(value)}
          sx={{
            marginY: (theme) => theme.spacing(0.5),
            ...ratingProps?.sx,
          }}
        />

        {(error?.message || description) && (
          <FormHelperText {...formHelperTextProps}>
            {error?.message || description}
          </FormHelperText>
        )}
      </FormControl>
    )}
  />
);

export default ControlledRating;
