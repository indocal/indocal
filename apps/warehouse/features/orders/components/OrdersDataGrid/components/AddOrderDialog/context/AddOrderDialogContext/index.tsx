import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { entitySchema } from '@indocal/utils';

export type AddOrderDialogData = zod.infer<typeof schema>;

const itemSchema = zod.object(
  {
    price: zod
      .number({
        description: 'Precio',
        required_error: 'Debe ingresar el precio',
        invalid_type_error: 'Formato no válido',
      })
      .positive('Debe ingresar un precio válido'),

    quantity: zod
      .number({
        description: 'Cantidad solicitada',
        required_error: 'Debe ingresar la cantidad solicitada',
        invalid_type_error: 'Formato no válido',
      })
      .int('Debe ingresar una cantidad válida')
      .positive('Debe ingresar una cantidad válida'),

    supply: entitySchema({
      description: 'Recurso',
      required_error: 'Debe seleccionar el recurso',
      invalid_type_error: 'Formato no válido',
    }),
  },
  {
    description: 'Datos del artículo',
    required_error: 'Debe ingresar los datos del artículo',
    invalid_type_error: 'Formato no válido',
  }
);

const schema = zod.object(
  {
    code: zod
      .string({
        description: 'Código de la orden',
        required_error: 'Debe ingresar el código de la orden',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el código de la orden')
      .trim(),

    concept: zod
      .string({
        description: 'Concepto de la orden',
        required_error: 'Debe ingresar el concepto de la orden',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el concepto de la orden')
      .trim(),

    supplier: entitySchema({
      description: 'Suplidor de la orden',
      required_error: 'Debe seleccionar el suplidor',
      invalid_type_error: 'Formato no válido',
    }),

    requestedBy: entitySchema({
      description: 'Solicitante de la orden',
      required_error: 'Debe seleccionar el solicitante',
      invalid_type_error: 'Formato no válido',
    }),

    items: itemSchema.array().min(1, 'Debe ingresar al menos un artículo'),
  },
  {
    description: 'Datos de la orden',
    required_error: 'Debe ingresar los datos de la orden',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddOrderDialogProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const methods = useForm<AddOrderDialogData>({
    resolver: zodResolver(schema),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default AddOrderDialogProvider;
