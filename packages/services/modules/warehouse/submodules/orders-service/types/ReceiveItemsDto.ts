import { UUID } from '../../../../../common';

type Item = {
  quantity: number;
  item: UUID;
};

export type ReceiveItemsDto = {
  order: UUID;
  received: Item[];
};

export default ReceiveItemsDto;
