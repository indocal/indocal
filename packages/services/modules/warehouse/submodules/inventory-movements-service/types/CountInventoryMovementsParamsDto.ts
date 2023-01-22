import { Prisma } from '@prisma/client';

import { CountParams } from '../../../../../common';

export type CountInventoryMovementsParamsDto = CountParams<
  Prisma.InventoryMovementWhereInput,
  Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>
>;

export default CountInventoryMovementsParamsDto;
