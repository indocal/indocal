import { SupplyUnit } from '../../types';

export function translateSupplyUnit(unit: SupplyUnit): string {
  const translations: Record<SupplyUnit, string> = {
    UNIT: 'Unidad',
    PACK: 'Paquete',
    BOX: 'Caja',

    BLOCK: 'Bloque',
    REAM: 'Resma',
    BALE: 'Fardo',

    SACK: 'Saco',
    GALLON: 'Galón',
  };

  return translations[unit] ?? unit;
}

export default translateSupplyUnit;
