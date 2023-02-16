import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  InventoryMovement,
  InventoryMovementItem,
  Supply,
  Order,
  Supplier,
  UserGroup,
} from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { InventoryMovementItemEntity } from '../inventory-movements-items/entities';
import { SupplyEntity } from '../supplies/entities';
import { OrderEntity } from '../orders/entities';
import { SupplierEntity } from '../suppliers/entities';
import { UserGroupEntity } from '../../../auth/submodules/groups/entities';

import {
  InvalidQuantityException,
  InsufficientQuantityException,
} from '../../errors';

import { InventoryMovementEntity } from './entities';
import {
  FindManyInventoryMovementsParamsDto,
  CountInventoryMovementsParamsDto,
  CreateInventoryMovementDto,
} from './dto';

class EnhancedInventoryMovementItem extends InventoryMovementItemEntity {
  supply: SupplyEntity;
}

class EnhancedOrder extends OrderEntity {
  supplier: SupplierEntity;
  requestedBy: UserGroupEntity;
}

class EnhancedInventoryMovement extends InventoryMovementEntity {
  items: EnhancedInventoryMovementItem[];
  order: EnhancedOrder | null;
  origin: UserGroupEntity | null;
  destination: UserGroupEntity | null;
}

type CreateEnhancedInventoryMovement = InventoryMovement & {
  items: (InventoryMovementItem & { supply: Supply })[];
  order: (Order & { supplier: Supplier; requestedBy: UserGroup }) | null;
  origin: UserGroup | null;
  destination: UserGroup | null;
};

@Controller('warehouse/movements')
@UseGuards(PoliciesGuard)
export class InventoryMovementsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedInventoryMovement({
    items,
    order,
    origin,
    destination,
    ...rest
  }: CreateEnhancedInventoryMovement): EnhancedInventoryMovement {
    const movement = new EnhancedInventoryMovement(rest);

    if (order) {
      movement.order = new EnhancedOrder(order);
      movement.order.supplier = new SupplierEntity(order.supplier);
      movement.order.requestedBy = new UserGroupEntity(order.requestedBy);
    } else {
      movement.order = null;
    }

    movement.origin = origin ? new UserGroupEntity(origin) : null;
    movement.destination = destination
      ? new UserGroupEntity(destination)
      : null;

    movement.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedInventoryMovementItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    return movement;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'inventoryMovement'))
  async create(
    @Body() createInventoryMovementDto: CreateInventoryMovementDto
  ): Promise<SingleEntityResponse<EnhancedInventoryMovement>> {
    const movement = await this.prismaService.$transaction(async (tx) => {
      const movement = await tx.inventoryMovement.create({
        data: {
          type: createInventoryMovementDto.type,
          concept: createInventoryMovementDto.concept,
          items: {
            createMany: {
              skipDuplicates: true,
              data: createInventoryMovementDto.items.map((item) => ({
                quantity: item.quantity,
                supplyId: item.supply,
              })),
            },
          },

          ...(createInventoryMovementDto.order && {
            order: {
              connect: { id: createInventoryMovementDto.order },
            },
          }),

          ...(createInventoryMovementDto.origin && {
            origin: {
              connect: { id: createInventoryMovementDto.origin },
            },
          }),

          ...(createInventoryMovementDto.destination && {
            destination: {
              connect: { id: createInventoryMovementDto.destination },
            },
          }),
        },
        include: {
          items: { include: { supply: true } },
          order: { include: { supplier: true, requestedBy: true } },
          origin: true,
          destination: true,
        },
      });

      switch (movement.type) {
        case 'ADJUSTMENT': {
          await Promise.all(
            movement.items.map(async (item) => {
              if (item.quantity === 0) {
                throw new InvalidQuantityException({
                  supply: item.supply.name,
                  quantity: item.quantity,
                });
              }

              if (
                item.quantity < 0 &&
                Math.abs(item.quantity) > item.supply.quantity
              ) {
                throw new InsufficientQuantityException({
                  supply: item.supply.name,
                  remaining: item.supply.quantity,
                  requested: item.quantity,
                });
              }

              await tx.supply.update({
                where: { id: item.supply.id },
                data: {
                  quantity: {
                    ...(Math.sign(item.quantity)
                      ? { increment: item.quantity }
                      : { decrement: item.quantity }),
                  },
                },
              });
            })
          );
          break;
        }

        case 'INPUT': {
          await Promise.all(
            movement.items.map(async (item) => {
              if (item.quantity <= 0) {
                throw new InvalidQuantityException({
                  supply: item.supply.name,
                  quantity: item.quantity,
                });
              }

              await tx.supply.update({
                where: { id: item.supply.id },
                data: {
                  quantity: {
                    increment: item.quantity,
                  },
                },
              });
            })
          );
          break;
        }

        case 'OUTPUT': {
          await Promise.all(
            movement.items.map(async (item) => {
              if (item.quantity <= 0) {
                throw new InvalidQuantityException({
                  supply: item.supply.name,
                  quantity: item.quantity,
                });
              }

              if (item.quantity > item.supply.quantity) {
                throw new InsufficientQuantityException({
                  supply: item.supply.name,
                  remaining: item.supply.quantity,
                  requested: item.quantity,
                });
              }

              await tx.supply.update({
                where: { id: item.supply.id },
                data: {
                  quantity: {
                    decrement: item.quantity,
                  },
                },
              });
            })
          );
          break;
        }
      }

      return movement;
    });

    return this.createEnhancedInventoryMovement(movement);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'inventoryMovement'))
  async count(
    @Query() query: CountInventoryMovementsParamsDto
  ): Promise<number> {
    return await this.prismaService.inventoryMovement.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'inventoryMovement'))
  async findMany(
    @Query() query: FindManyInventoryMovementsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedInventoryMovement>> {
    const [movements, count] = await this.prismaService.$transaction([
      this.prismaService.inventoryMovement.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          items: { include: { supply: true } },
          order: { include: { supplier: true, requestedBy: true } },
          origin: true,
          destination: true,
        },
      }),
      this.prismaService.inventoryMovement.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: movements.map((movement) =>
        this.createEnhancedInventoryMovement(movement)
      ),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'inventoryMovement'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedInventoryMovement | null>> {
    const movement = await this.prismaService.inventoryMovement.findUnique({
      where: { id },
      include: {
        items: { include: { supply: true } },
        order: { include: { supplier: true, requestedBy: true } },
        origin: true,
        destination: true,
      },
    });

    return movement ? this.createEnhancedInventoryMovement(movement) : null;
  }
}

export default InventoryMovementsController;
