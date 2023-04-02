import { SupplyRequestItemDeliveryStatus } from '../../types';

export function translateSupplyRequestItemDeliveryStatus(
  status: SupplyRequestItemDeliveryStatus
): string {
  const translations: Record<SupplyRequestItemDeliveryStatus, string> = {
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    COMPLETED: 'Completado',
  };

  return translations[status] ?? status;
}

export default translateSupplyRequestItemDeliveryStatus;
