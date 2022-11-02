import { FormStatus } from '../../types';

export function translateFormStatus(status: FormStatus): string {
  const translations: Record<FormStatus, string> = {
    DRAFT: 'Borrador',
    PUBLISHED: 'Publicado',
    HIDDEN: 'Oculto',
  };

  return translations[status] ?? status;
}

export default translateFormStatus;
