import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Typography,
  FormControlProps,
  FormLabelProps,
  FormHelperTextProps,
  TypographyProps,
} from '@mui/material';
import { Draw as SignatureIcon } from '@mui/icons-material';
import { Controller, ControllerProps, Control } from 'react-hook-form';

import {
  ControlledSignaturePadProvider,
  useControlledSignaturePad,
} from './context';
import { SignaturePadDialog } from './components';

export interface ControlledSignaturePadProps {
  name: string;
  label?: string;
  description?: string | null;
  control: Control;
  size?: 'small' | 'normal';
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'error'>;
  formLabelProps?: FormLabelProps;
  formHelperTextProps?: FormHelperTextProps;
  typographyProps?: TypographyProps;
}

const ControlledSignaturePad: React.FC<ControlledSignaturePadProps> = ({
  name,
  label,
  description,
  control,
  size,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  typographyProps,
}) => {
  const { isSignaturePadDialogOpen, toggleSignaturePadDialog } =
    useControlledSignaturePad();

  return (
    <Controller
      {...controllerProps}
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl {...formControlProps} error={Boolean(error)}>
          {label && <FormLabel>{label}</FormLabel>}

          {isSignaturePadDialogOpen && (
            <SignaturePadDialog
              title={label}
              value={value}
              onChange={onChange}
            />
          )}

          <Stack
            onClick={toggleSignaturePadDialog}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: size === 'small' ? 150 : '100%',
              height: size === 'small' ? 75 : 200,
              ...(label && { marginY: (theme) => theme.spacing(1) }),
              borderRadius: (theme) => theme.spacing(0.5),
              opacity: 0.75,
              padding: (theme) => theme.spacing(2),
              border: (theme) => `2px dashed ${theme.palette.divider}`,
              backgroundColor: (theme) =>
                theme.palette.action.disabledBackground,
            }}
          >
            {value ? (
              <Box
                component="img"
                src={value}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  '&:hover': { cursor: 'pointer' },
                }}
              />
            ) : (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                <SignatureIcon />

                <Typography align="center" {...typographyProps}>
                  Firma aquí
                </Typography>
              </Stack>
            )}
          </Stack>

          {(error?.message || description) && (
            <FormHelperText {...formHelperTextProps}>
              {error?.message || description}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

const ControlledSignaturePadWrapper: React.FC<ControlledSignaturePadProps> = (
  props
) => {
  return (
    <ControlledSignaturePadProvider>
      <ControlledSignaturePad {...props} />
    </ControlledSignaturePadProvider>
  );
};

export { ControlledSignaturePadWrapper as ControlledSignaturePad };

export default ControlledSignaturePadWrapper;
