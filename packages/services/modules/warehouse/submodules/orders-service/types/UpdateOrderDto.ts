import { OrderStatus } from './Order';

export type UpdateOrderDto = Partial<{
  code: string;
  status: OrderStatus;
}>;

export default UpdateOrderDto;
