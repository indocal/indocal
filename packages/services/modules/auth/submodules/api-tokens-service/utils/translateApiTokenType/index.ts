import { ApiTokenType } from '../../types';

export function translateApiTokenType(type: ApiTokenType): string {
  const translations: Record<ApiTokenType, string> = {
    READ_ONLY: 'Sólo lectura',
    READ_WRITE: 'Lectura y escritura',
  };

  return translations[type] ?? type;
}

export default translateApiTokenType;
