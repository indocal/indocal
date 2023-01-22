import { Prisma } from '@prisma/client';

import { FindManyParams } from '../../../../../common';

export type FindManyInventoryMovementsParamsDto = FindManyParams<
  Prisma.InventoryMovementWhereInput,
  Prisma.Enumerable<Prisma.InventoryMovementScalarFieldEnum>,
  Prisma.Enumerable<Prisma.InventoryMovementOrderByWithRelationInput>,
  Prisma.InventoryMovementWhereUniqueInput
>;

export default FindManyInventoryMovementsParamsDto;
