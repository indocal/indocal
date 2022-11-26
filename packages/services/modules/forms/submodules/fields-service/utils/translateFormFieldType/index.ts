import { FormFieldType } from '../../types';

export function translateFormFieldType(type: FormFieldType): string {
  const translations: Record<FormFieldType, string> = {
    TEXT: 'Texto (Corto)',
    TEXTAREA: 'Texto (Largo)',
    NUMBER: 'Numérico',

    DNI: 'Cédula',
    PHONE: 'Teléfono',
    EMAIL: 'Correo electrónico',

    CHECKBOX: 'Checkbox',
    SELECT: 'Select',
    RADIO: 'Radio',

    TIME: 'Hora',
    DATE: 'Fecha',
    DATETIME: 'Fecha y hora',

    USERS: 'Usuarios (INDOCAL)',

    TABLE: 'Tabla',
  };

  return translations[type] ?? type;
}

export default translateFormFieldType;
