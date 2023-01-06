import { OrderStatus } from '../../types';

export function translateOrderStatus(status: OrderStatus): string {
  const translations: Record<OrderStatus, string> = {
    PENDING: 'Pendiente',
    PARTIAL: 'Parcial',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  };

  return translations[status] ?? status;
}

export default translateOrderStatus;
