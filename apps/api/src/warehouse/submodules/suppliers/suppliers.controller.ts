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

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';

import WarehouseSuppliersService from './suppliers.service';
import { WarehouseSupplierEntity } from './entities';
import {
  FindManyWarehouseSuppliersParamsDto,
  CountWarehouseSuppliersParamsDto,
  CreateWarehouseSupplierDto,
  UpdateWarehouseSupplierDto,
} from './dto';

@Controller('warehouse/suppliers')
@UseGuards(PoliciesGuard)
export class WarehouseSuppliersController {
  constructor(private warehouseSuppliersService: WarehouseSuppliersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'supplier'))
  async create(
    @Body() createWarehouseSupplierDto: CreateWarehouseSupplierDto
  ): Promise<WarehouseSupplierEntity> {
    const supplier = await this.warehouseSuppliersService.create(
      createWarehouseSupplierDto
    );

    return new WarehouseSupplierEntity(supplier);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'supplier'))
  async count(
    @Query() query: CountWarehouseSuppliersParamsDto
  ): Promise<number> {
    return await this.warehouseSuppliersService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplier'))
  async findMany(
    @Query() query: FindManyWarehouseSuppliersParamsDto
  ): Promise<WarehouseSupplierEntity[]> {
    const suppliers = await this.warehouseSuppliersService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return suppliers.map((supplier) => new WarehouseSupplierEntity(supplier));
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplier'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<WarehouseSupplierEntity | null> {
    const supplier = await this.warehouseSuppliersService.findUnique({ id });

    return supplier ? new WarehouseSupplierEntity(supplier) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'supplier'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateWarehouseSupplierDto: UpdateWarehouseSupplierDto
  ): Promise<WarehouseSupplierEntity> {
    const supplier = await this.warehouseSuppliersService.update(
      id,
      updateWarehouseSupplierDto
    );

    return new WarehouseSupplierEntity(supplier);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'supplier'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<WarehouseSupplierEntity> {
    const supplier = await this.warehouseSuppliersService.delete(id);

    return new WarehouseSupplierEntity(supplier);
  }
}

export default WarehouseSuppliersController;
