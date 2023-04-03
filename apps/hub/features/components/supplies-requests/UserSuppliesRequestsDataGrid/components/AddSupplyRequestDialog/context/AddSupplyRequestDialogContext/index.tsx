import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

export type AddSupplyRequestDialogData = zod.infer<typeof schema>;

const itemSchema = zod.object(
  {
    quantity: zod
      .number({
        description: 'Cantidad solicitada',
        required_error: 'Debe ingresar la cantidad solicitada',
        invalid_type_error: 'Formato no válido',
      })
      .int('Debe ingresar una cantidad válida')
      .positive('Debe ingresar una cantidad válida'),

    supply: zod.object(
      {
        id: zod.string().uuid(),
        code: zod.string(),
        name: zod.string(),
        description: zod.string().nullable(),
        quantity: zod.number(),
        unit: zod.string(),
        createdAt: zod.string(),
        updatedAt: zod.string(),
      },
      {
        description: 'Recurso',
        required_error: 'Debe seleccionar el recurso',
        invalid_type_error: 'Formato no válido',
      }
    ),
  },
  {
    description: 'Datos del artículo',
    required_error: 'Debe ingresar los datos del artículo',
    invalid_type_error: 'Formato no válido',
  }
);

const schema = zod.object(
  {
    description: zod
      .string({
        description: 'Descripción de la solicitud',
        required_error: 'Debe ingresar la descripción de la solicitud',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar la descripción de la solicitud')
      .trim(),

    items: itemSchema.array().min(1, 'Debe ingresar al menos un artículo'),
  },
  {
    description: 'Datos de la solicitud',
    required_error: 'Debe ingresar los datos de la solicitud',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddSupplyRequestDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const methods = useForm<AddSupplyRequestDialogData>({
    resolver: zodResolver(schema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default AddSupplyRequestDialogProvider;
