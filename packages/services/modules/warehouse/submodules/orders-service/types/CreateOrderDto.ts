import { UUID } from '../../../../../common';

export type CreateOrderDto = {
  code: string;
  supplier: UUID;
};

export default CreateOrderDto;
