import { UUID } from '../../../common';

type Item = {
  quantity: number;
  item: UUID;
};

export type ReceiveItemsDto = {
  received: Item[];
  order: UUID;
};

export default ReceiveItemsDto;
