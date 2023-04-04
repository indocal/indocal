import { UUID } from '../../../../../common';

type SupplyRequestItem = {
  quantity: number;
  supply: UUID;
};

export type CreateSupplyRequestDto = {
  description: string;
  requestedBy: UUID;
  items: SupplyRequestItem[];
};

export default CreateSupplyRequestDto;
