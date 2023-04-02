import { UUID } from '../../../../../common';

type Item = {
  quantity: number;
  item: UUID;
};

export type DispatchItemsDto = {
  received: Item[];
  request: UUID;
};

export default DispatchItemsDto;
