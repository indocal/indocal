import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import { InventoryMovementType } from '@indocal/services';
import { entitySchema } from '@indocal/utils';

export type AddInventoryMovementDialogData = zod.infer<typeof schema>;

const itemSchema = zod.object(
  {
    quantity: zod
      .number({
        description: 'Cantidad solicitada',
        required_error: 'Debe ingresar la cantidad solicitada',
        invalid_type_error: 'Formato no válido',
      })
      .int('Debe ingresar una cantidad válida'),

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
    type: zod
      .enum<
        string,
        [
          Exclude<InventoryMovementType, 'INPUT'>,
          ...Exclude<InventoryMovementType, 'INPUT'>[]
        ]
      >(['ADJUSTMENT', 'OUTPUT', 'TRANSFER', 'DISCHARGE'], {
        description: 'Tipo de movimiento',
        required_error: 'Debe seleccionar el tipo de movimiento',
        invalid_type_error: 'Formato no válido',
      })
      .describe('Tipo de movimiento'),

    concept: zod
      .string({
        description: 'Concepto del movimiento',
        required_error: 'Debe ingresar el concepto del movimiento',
        invalid_type_error: 'Formato no válido',
      })
      .min(1, 'Debe ingresar el concepto del movimiento'),

    items: itemSchema.array().min(1, 'Debe ingresar al menos un artículo'),

    origin: entitySchema({
      description: 'Área origen',
      required_error: 'Debe seleccionar el área origen',
      invalid_type_error: 'Formato no válido',
    }).nullish(),

    destination: entitySchema({
      description: 'Área destino',
      required_error: 'Debe seleccionar el área destino',
      invalid_type_error: 'Formato no válido',
    }).nullish(),
  },
  {
    description: 'Datos del movimiento',
    required_error: 'Debe ingresar los datos del movimiento',
    invalid_type_error: 'Formato no válido',
  }
);

export const AddInventoryMovementDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const methods = useForm<AddInventoryMovementDialogData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'OUTPUT' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export default AddInventoryMovementDialogProvider;
