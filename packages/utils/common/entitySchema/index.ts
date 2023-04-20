import { z as zod } from 'zod';

type Entity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export const entitySchema = (
  params: zod.RawCreateParams
): zod.ZodSchema<Entity> =>
  zod.object(
    {
      id: zod
        .string({
          description: 'ID de la entidad',
          required_error: 'Debe ingresar un ID válido',
          invalid_type_error: 'Formato no válido',
        })
        .uuid('Debe ingresar un UUID válido'),

      createdAt: zod.string({
        description: 'Fecha de creación',
        required_error: 'Debe ingresar una fecha de creación válida',
        invalid_type_error: 'Formato no válido',
      }),

      updatedAt: zod.string({
        description: 'Fecha de actualización',
        required_error: 'Debe ingresar una fecha de actualización válida',
        invalid_type_error: 'Formato no válido',
      }),
    },
    params
  );

export default entitySchema;
