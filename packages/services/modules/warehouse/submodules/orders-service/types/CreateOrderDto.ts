import { UUID } from '../../../../../common';

type OrdenItem = {
  price: number;
  quantity: number;
  supply: UUID;
};

export type CreateOrderDto = {
  code: string;
  concept: string;
  supplier: UUID;
  requestedBy: UUID;
  items: OrdenItem[];
};

export default CreateOrderDto;
