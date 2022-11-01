import { FormFieldType } from '../../types';

export function translateFormFieldType(type: FormFieldType): string {
  const translations: Record<FormFieldType, string> = {
    CHECKBOX: 'Checkbox',
    EMAIL: 'Correo electrónico',
    NUMBER: 'Número',
    RADIO: 'Radio',
    TEXT: 'Texto (Corto)',
    TEXTAREA: 'Texto (Largo)',
  };

  return translations[type] ?? type;
}

export default translateFormFieldType;
