import { ServiceProcessStepType } from '../../types';

export function translateServiceProcessStepType(
  type: ServiceProcessStepType
): string {
  const translations: Record<ServiceProcessStepType, string> = {
    START: 'Inicio',
    DUMMY: 'Dummy',
    END: 'Fin',
  };

  return translations[type] ?? type;
}

export default translateServiceProcessStepType;
