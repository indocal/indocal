import { ServiceStatus } from '../../types';

export function translateServiceStatus(status: ServiceStatus): string {
  const translations: Record<ServiceStatus, string> = {
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    HIDDEN: 'Oculto',
  };

  return translations[status] ?? status;
}

export default translateServiceStatus;
