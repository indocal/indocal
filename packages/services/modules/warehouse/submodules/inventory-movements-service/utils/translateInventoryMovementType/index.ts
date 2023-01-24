import { InventoryMovementType } from '../../types';

export function translateInventoryMovementType(
  type: InventoryMovementType
): string {
  const translations: Record<InventoryMovementType, string> = {
    ADJUSTMENT: 'Ajuste',
    INPUT: 'Entrada',
    OUTPUT: 'Salida',
    TRANSFER: 'Traslado',
    DISCHARGE: 'Descargo',
  };

  return translations[type] ?? type;
}

export default translateInventoryMovementType;
