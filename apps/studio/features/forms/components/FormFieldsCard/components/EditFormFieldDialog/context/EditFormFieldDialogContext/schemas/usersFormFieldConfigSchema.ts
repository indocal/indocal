import { z as zod } from 'zod';

export const usersFormFieldConfigSchema = zod.object({
  multiple: zod.boolean({
    description: '¿Campo múltiple?',
    required_error: 'Debe indicar si el campo es múltiple o no',
    invalid_type_error: 'Formato no válido',
  }),
});

export default usersFormFieldConfigSchema;
