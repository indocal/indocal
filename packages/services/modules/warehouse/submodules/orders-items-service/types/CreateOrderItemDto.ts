import { UUID } from '../../../../../common';

export type CreateOrderItemDto = {
  price: number;
  quantity: number;
  supply: UUID;
};

export default CreateOrderItemDto;
