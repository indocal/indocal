import { UUID } from '../../../../../common';

type Item = {
  quantity: number;
  item: UUID;
};

export type DispatchItemsDto = {
  request: UUID;
  received: Item[];
};

export default DispatchItemsDto;
