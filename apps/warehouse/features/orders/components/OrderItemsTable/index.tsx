import { Order } from '@indocal/services';

export interface OrderItemsTableProps {
  order: Order;
}

export const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ order }) => {
  return <pre>{JSON.stringify(order.items, null, 2)}</pre>;
};

export default OrderItemsTable;
