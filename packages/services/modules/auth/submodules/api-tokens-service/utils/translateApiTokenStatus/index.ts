import { ApiTokenStatus } from '../../types';

export function translateApiTokenStatus(status: ApiTokenStatus): string {
  const translations: Record<ApiTokenStatus, string> = {
    ENABLED: 'Habilitado',
    DISABLED: 'Deshabilitado',
  };

  return translations[status] ?? status;
}

export default translateApiTokenStatus;
