import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies, Action, UserEntity } from '@/auth';
import { SupplyEntity } from '@/warehouse';
import { PrismaService } from '@/prisma';

import { SupplyMovementEntity } from './entities';
import {
  FindManySuppliesMovementsParamsDto,
  CountSuppliesMovementsParamsDto,
  CreateSupplyMovementDto,
  UpdateSupplyMovementDto,
} from './dto';

class EnhancedSupplyMovement extends SupplyMovementEntity {
  supply: SupplyEntity | null;
  origin: UserEntity | null;
  destination: UserEntity | null;
}

@Controller('warehouse/supplyMovements')
@UseGuards(PoliciesGuard)
export class SuppliesMovementsController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'supplyMovement'))
  async create(
    @Body() createSupplyMovementDto: CreateSupplyMovementDto
  ): Promise<SingleEntityResponse<EnhancedSupplyMovement>> {
    const { supply, origin, destination, ...rest } =
      await this.prismaService.supplyMovement.create({
        data: {
          type: createSupplyMovementDto.type,
          quantity: createSupplyMovementDto.quantity,
          supply: { connect: { id: createSupplyMovementDto.supply } },

          ...(createSupplyMovementDto.origin && {
            origin: {
              connect: { id: createSupplyMovementDto.origin },
            },
          }),

          ...(createSupplyMovementDto.destination && {
            destination: {
              connect: { id: createSupplyMovementDto.destination },
            },
          }),
        },
        include: { supply: true, origin: true, destination: true },
      });

    const movement = new EnhancedSupplyMovement(rest);

    movement.supply = new SupplyEntity(supply);
    movement.origin = origin ? new UserEntity(origin) : null;
    movement.destination = destination ? new UserEntity(destination) : null;

    return movement;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'supplyMovement'))
  async count(
    @Query() query: CountSuppliesMovementsParamsDto
  ): Promise<number> {
    return await this.prismaService.supplyMovement.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplyMovement'))
  async findMany(
    @Query() query: FindManySuppliesMovementsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedSupplyMovement>> {
    const [supplyMovements, count] = await this.prismaService.$transaction([
      this.prismaService.supplyMovement.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { supply: true, origin: true, destination: true },
      }),
      this.prismaService.supplyMovement.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: supplyMovements.map(
        ({ supply, origin, destination, ...rest }) => {
          const movement = new EnhancedSupplyMovement(rest);

          movement.supply = new SupplyEntity(supply);
          movement.origin = origin ? new UserEntity(origin) : null;
          movement.destination = destination
            ? new UserEntity(destination)
            : null;

          return movement;
        }
      ),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplyMovement'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedSupplyMovement | null>> {
    const response = await this.prismaService.supplyMovement.findUnique({
      where: { id },
      include: { supply: true, origin: true, destination: true },
    });

    if (!response) return null;

    const { supply, origin, destination, ...rest } = response;

    const movement = new EnhancedSupplyMovement(rest);

    movement.supply = new SupplyEntity(supply);
    movement.origin = origin ? new UserEntity(origin) : null;
    movement.destination = destination ? new UserEntity(destination) : null;

    return movement;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'supplyMovement'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateSupplyMovementDto: UpdateSupplyMovementDto
  ): Promise<SingleEntityResponse<EnhancedSupplyMovement>> {
    const { supply, origin, destination, ...rest } =
      await this.prismaService.supplyMovement.update({
        where: { id },
        data: {},
        include: { supply: true, origin: true, destination: true },
      });

    const movement = new EnhancedSupplyMovement(rest);

    movement.supply = new SupplyEntity(supply);
    movement.origin = origin ? new UserEntity(origin) : null;
    movement.destination = destination ? new UserEntity(destination) : null;

    return movement;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'supplyMovement'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedSupplyMovement>> {
    const { supply, origin, destination, ...rest } =
      await this.prismaService.supplyMovement.delete({
        where: { id },
        include: { supply: true, origin: true, destination: true },
      });

    const movement = new EnhancedSupplyMovement(rest);

    movement.supply = new SupplyEntity(supply);
    movement.origin = origin ? new UserEntity(origin) : null;
    movement.destination = destination ? new UserEntity(destination) : null;

    return movement;
  }
}

export default SuppliesMovementsController;
