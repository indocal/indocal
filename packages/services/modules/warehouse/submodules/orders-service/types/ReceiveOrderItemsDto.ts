import { UUID } from '../../../../../common';

type Item = {
  quantity: number;
  item: UUID;
};

export type ReceiveOrderItemsDto = {
  received: Item[];
};

export default ReceiveOrderItemsDto;
