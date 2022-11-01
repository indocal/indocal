import { UserStatus } from '../../types';

export function translateUserStatus(status: UserStatus): string {
  const translations: Record<UserStatus, string> = {
    ENABLED: 'Habilitado',
    DISABLED: 'Deshabilitado',
  };

  return translations[status] ?? status;
}

export default translateUserStatus;
