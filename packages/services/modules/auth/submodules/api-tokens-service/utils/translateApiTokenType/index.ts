import { ApiTokenType } from '../../types';

export function translateApiTokenType(type: ApiTokenType): string {
  const translations: Record<ApiTokenType, string> = {
    ANON: 'Anónimo',
    SERVICE: 'Servicio',
  };

  return translations[type] ?? type;
}

export default translateApiTokenType;
