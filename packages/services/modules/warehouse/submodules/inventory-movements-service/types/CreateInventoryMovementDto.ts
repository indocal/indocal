import { UUID } from '../../../../../common';

import { InventoryMovementType } from './InventoryMovement';

type Item = {
  quantity: number;
  supply: UUID;
};

export type CreateInventoryMovementDto = {
  type: InventoryMovementType;
  concept?: string;
  items: Item[];
  order?: UUID;
  origin?: UUID;
  destination?: UUID;
};

export default CreateInventoryMovementDto;
