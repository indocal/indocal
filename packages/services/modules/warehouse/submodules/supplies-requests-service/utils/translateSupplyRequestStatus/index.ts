import { SupplyRequestStatus } from '../../types';

export function translateSupplyRequestStatus(
  status: SupplyRequestStatus
): string {
  const translations: Record<SupplyRequestStatus, string> = {
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  };

  return translations[status] ?? status;
}

export default translateSupplyRequestStatus;
