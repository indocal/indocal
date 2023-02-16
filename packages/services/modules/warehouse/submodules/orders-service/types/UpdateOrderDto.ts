import { OrderStatus } from './Order';

export type UpdateOrderDto = Partial<{
  code: string;
  concept: string;
  status: OrderStatus;
}>;

export default UpdateOrderDto;
