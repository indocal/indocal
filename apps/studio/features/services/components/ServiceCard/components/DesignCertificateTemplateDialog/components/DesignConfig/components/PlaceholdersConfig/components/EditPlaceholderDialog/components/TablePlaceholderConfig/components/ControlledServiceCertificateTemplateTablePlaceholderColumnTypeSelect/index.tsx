import { useMemo } from 'react';
import {
  MenuItem,
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps,
  SelectProps,
} from '@mui/material';
import { Control, ControllerProps } from 'react-hook-form';

import { ControlledSelect } from '@indocal/ui';
import {
  translateServiceCertificateTemplatePlaceholderType,
  ServiceCertificateTemplateTablePlaceholderColumnType,
  ServiceCertificateTemplatePlaceholderType,
} from '@indocal/services';

export interface ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelectProps {
  name: string;
  label?: string;
  control: Control;
  disabled?: boolean;
  required?: boolean;
  controllerProps?: Omit<ControllerProps, 'name' | 'control' | 'render'>;
  formControlProps?: Omit<FormControlProps, 'required' | 'disabled' | 'error'>;
  formHelperTextProps?: FormHelperTextProps;
  inputLabelProps?: InputLabelProps;
  selectProps?: Omit<SelectProps, 'label' | 'value' | 'onChange'>;
}

export const ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelect: React.FC<
  ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelectProps
> = ({
  name,
  label,
  control,
  disabled,
  required,
  controllerProps,
  formControlProps,
  formHelperTextProps,
  inputLabelProps,
  selectProps,
}) => {
  const types = useMemo<ServiceCertificateTemplateTablePlaceholderColumnType[]>(
    () => [
      ServiceCertificateTemplateTablePlaceholderColumnType.TEXT,
      ServiceCertificateTemplateTablePlaceholderColumnType.SIGNATURE,
    ],
    []
  );

  return (
    <ControlledSelect
      name={name}
      label={label}
      control={control}
      controllerProps={controllerProps}
      formControlProps={{ required, disabled, ...formControlProps }}
      formHelperTextProps={formHelperTextProps}
      inputLabelProps={inputLabelProps}
      selectProps={selectProps}
    >
      {types.map((type) => (
        <MenuItem key={type} value={type}>
          {translateServiceCertificateTemplatePlaceholderType(
            type as unknown as ServiceCertificateTemplatePlaceholderType
          )}
        </MenuItem>
      ))}
    </ControlledSelect>
  );
};

export default ControlledServiceCertificateTemplateTablePlaceholderColumnTypeSelect;
