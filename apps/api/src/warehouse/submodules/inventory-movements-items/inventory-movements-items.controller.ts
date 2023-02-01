import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  InventoryMovementItem,
  Supply,
  Order,
  Supplier,
  User,
  InventoryMovement,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';
import { PrismaService } from '@/prisma';

import { SupplyEntity } from '../supplies/entities';
import { OrderEntity } from '../orders/entities';
import { SupplierEntity } from '../suppliers/entities';
import { UserEntity } from '../../../auth/submodules/users/entities';
import { InventoryMovementEntity } from '../inventory-movements/entities';

import { InventoryMovementItemEntity } from './entities';

class EnhancedOrder extends OrderEntity {
  supplier: SupplierEntity;
}

class EnhancedInventoryMovement extends InventoryMovementEntity {
  order: EnhancedOrder | null;
  origin: UserEntity | null;
  destination: UserEntity | null;
}

class EnhancedInventoryMovementItem extends InventoryMovementItemEntity {
  supply: SupplyEntity;
  movement: EnhancedInventoryMovement;
}

type CreateEnhancedInventoryMovementItem = InventoryMovementItem & {
  supply: Supply;
  movement: InventoryMovement & {
    order: (Order & { supplier: Supplier }) | null;
    origin: User | null;
    destination: User | null;
  };
};

@Controller()
@UseGuards(PoliciesGuard)
export class InventoryMovementsItemsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedInventoryMovementItem({
    movement: { order, origin, destination, ...movement },
    supply,
    ...rest
  }: CreateEnhancedInventoryMovementItem): EnhancedInventoryMovementItem {
    const item = new EnhancedInventoryMovementItem(rest);
    item.supply = new SupplyEntity(supply);
    item.movement = new EnhancedInventoryMovement(movement);

    if (order) {
      const { supplier, ...info } = order;

      item.movement.order = new EnhancedOrder(info);
      item.movement.order.supplier = new SupplierEntity(supplier);
    } else {
      item.movement.order = null;
    }

    item.movement.origin = origin ? new UserEntity(origin) : null;
    item.movement.destination = destination
      ? new UserEntity(destination)
      : null;

    return item;
  }

  @Get('warehouse/movements/:movement_id/items/count')
  @CheckPolicies((ability) => ability.can('count', 'inventoryMovementItem'))
  async count(@Param('movement_id') movementId: UUID): Promise<number> {
    return await this.prismaService.inventoryMovementItem.count({
      where: { movement: { id: movementId } },
    });
  }

  @Get('warehouse/movements/:movement_id/items')
  @CheckPolicies((ability) => ability.can('read', 'inventoryMovementItem'))
  async findAll(
    @Param('movement_id') movementId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedInventoryMovementItem>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.inventoryMovementItem.findMany({
        where: { movement: { id: movementId } },
        include: {
          movement: {
            include: {
              order: { include: { supplier: true } },
              origin: true,
              destination: true,
            },
          },
          supply: true,
        },
      }),
      this.prismaService.inventoryMovementItem.count({
        where: { movement: { id: movementId } },
      }),
    ]);

    return {
      count,
      entities: items.map((item) =>
        this.createEnhancedInventoryMovementItem(item)
      ),
    };
  }

  @Get('warehouse/movements/items/:id')
  @CheckPolicies((ability) => ability.can('read', 'inventoryMovementItem'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedInventoryMovementItem | null>> {
    const item = await this.prismaService.inventoryMovementItem.findUnique({
      where: { id },
      include: {
        movement: {
          include: {
            order: { include: { supplier: true } },
            origin: true,
            destination: true,
          },
        },
        supply: true,
      },
    });

    return item ? this.createEnhancedInventoryMovementItem(item) : null;
  }
}

export default InventoryMovementsItemsController;
