export type CommonFieldConfig = {
  required: boolean;
};

export type CheckboxFieldConfig = CommonFieldConfig;

export type EmailFieldConfig = CommonFieldConfig;

export type NumberFieldConfig = CommonFieldConfig & {
  min: number;
  max: number;
};

export type RadioFieldConfig = CommonFieldConfig & {
  options: { label: string; value: string }[];
};

export type TextFieldConfig = CommonFieldConfig & {
  minLength: number;
  maxLength: number;
};

export type TextAreaFieldConfig = CommonFieldConfig & {
  minLength: number;
  maxLength: number;
};
