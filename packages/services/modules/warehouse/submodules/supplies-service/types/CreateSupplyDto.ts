import { SupplyUnit } from './Supply';

export type CreateSupplyDto = {
  code: string;
  name: string;
  description?: string;
  quantity?: number;
  unit: SupplyUnit;
};

export default CreateSupplyDto;
