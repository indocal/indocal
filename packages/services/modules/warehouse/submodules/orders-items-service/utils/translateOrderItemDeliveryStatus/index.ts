import { OrderItemDeliveryStatus } from '../../types';

export function translateOrderItemDeliveryStatus(
  status: OrderItemDeliveryStatus
): string {
  const translations: Record<OrderItemDeliveryStatus, string> = {
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    COMPLETED: 'Completado',
  };

  return translations[status] ?? status;
}

export default translateOrderItemDeliveryStatus;
