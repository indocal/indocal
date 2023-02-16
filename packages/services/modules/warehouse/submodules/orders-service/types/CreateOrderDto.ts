import { UUID } from '../../../../../common';

type Item = {
  price: number;
  quantity: number;
  supply: UUID;
};

export type CreateOrderDto = {
  code: string;
  concept: string;
  supplier: UUID;
  requestedBy: UUID;
  items: Item[];
};

export default CreateOrderDto;
