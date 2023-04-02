import { UUID } from '../../../../../common';

type Item = {
  quantity: number;
  supply: UUID;
};

export type CreateSupplyRequestDto = {
  description: string;
  requestedBy: UUID;
  items: Item[];
};

export default CreateSupplyRequestDto;
