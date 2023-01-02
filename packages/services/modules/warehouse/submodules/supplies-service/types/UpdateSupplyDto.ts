import { SupplyUnit } from './Supply';

export type UpdateSupplyDto = Partial<{
  code: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: SupplyUnit;
}>;

export default UpdateSupplyDto;
