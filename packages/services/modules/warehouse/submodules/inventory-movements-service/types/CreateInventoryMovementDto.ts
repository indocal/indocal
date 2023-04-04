import { UUID } from '../../../../../common';

import { InventoryMovementType } from './InventoryMovement';

type InventoryMovementItem = {
  quantity: number;
  supply: UUID;
};

export type CreateInventoryMovementDto = {
  type: InventoryMovementType;
  concept: string;
  order?: UUID;
  origin?: UUID;
  destination?: UUID;
  items: InventoryMovementItem[];
};

export default CreateInventoryMovementDto;
