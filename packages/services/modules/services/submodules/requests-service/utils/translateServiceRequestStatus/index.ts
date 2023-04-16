import { ServiceRequestStatus } from '../../types';

export function translateServiceRequestStatus(
  status: ServiceRequestStatus
): string {
  const translations: Record<ServiceRequestStatus, string> = {
    PENDING: 'Pendiente',
    PENDING_APPROVAL: 'Pendiente de aprobación',
    PENDING_PAYMENT: 'Pendiente de pago',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completado',
    CANCELED: 'Cancelado',
  };

  return translations[status] ?? status;
}

export default translateServiceRequestStatus;
