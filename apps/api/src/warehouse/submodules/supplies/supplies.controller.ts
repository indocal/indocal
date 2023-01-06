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

import { PrismaService, UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import { SupplyEntity } from './entities';
import {
  FindManySuppliesParamsDto,
  CountSuppliesParamsDto,
  CreateSupplyDto,
  UpdateSupplyDto,
} from './dto';

@Controller('warehouse/supplies')
@UseGuards(PoliciesGuard)
export class SuppliesController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'supply'))
  async create(
    @Body() createSupplyDto: CreateSupplyDto
  ): Promise<SupplyEntity> {
    const supply = await this.prismaService.supply.create({
      data: {
        code: createSupplyDto.code,
        name: createSupplyDto.name,
        description: createSupplyDto.description,
        quantity: createSupplyDto.quantity,
        unit: createSupplyDto.unit,
      },
    });

    return new SupplyEntity(supply);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'supply'))
  async count(@Query() query: CountSuppliesParamsDto): Promise<number> {
    return await this.prismaService.supply.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'supply'))
  async findMany(
    @Query() query: FindManySuppliesParamsDto
  ): Promise<SupplyEntity[]> {
    const supplies = await this.prismaService.supply.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return supplies.map((supply) => new SupplyEntity(supply));
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supply'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SupplyEntity | null> {
    const supply = await this.prismaService.supply.findUnique({
      where: { id },
    });

    return supply ? new SupplyEntity(supply) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'supply'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateSupplyDto: UpdateSupplyDto
  ): Promise<SupplyEntity> {
    const supply = await this.prismaService.supply.update({
      where: { id },
      data: {
        code: updateSupplyDto.code,
        name: updateSupplyDto.name,
        description: updateSupplyDto.description,
        quantity: updateSupplyDto.quantity,
        unit: updateSupplyDto.unit,
      },
    });

    return new SupplyEntity(supply);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'supply'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<SupplyEntity> {
    const supply = await this.prismaService.supply.delete({ where: { id } });

    return new SupplyEntity(supply);
  }
}

export default SuppliesController;
