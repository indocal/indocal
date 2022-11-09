import { FormVisibility } from '../../types';

export function translateFormVisibility(visibility: FormVisibility): string {
  const translations: Record<FormVisibility, string> = {
    PUBLIC: 'Público',
    PROTECTED: 'Protegido',
    PRIVATE: 'Privado',
  };

  return translations[visibility] ?? visibility;
}

export default translateFormVisibility;
