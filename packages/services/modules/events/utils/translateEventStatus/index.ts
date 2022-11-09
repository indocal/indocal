import { EventStatus } from '../../types';

export function translateEventStatus(status: EventStatus): string {
  const translations: Record<EventStatus, string> = {
    SCHEDULED: 'Agendado',
    OVERDUED: 'Finalizado',
  };

  return translations[status] ?? status;
}

export default translateEventStatus;
