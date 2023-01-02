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

import SuppliersService from './suppliers.service';
import { SupplierEntity } from './entities';
import {
  FindManySuppliersParamsDto,
  CountSuppliersParamsDto,
  CreateSupplierDto,
  UpdateSupplierDto,
} from './dto';

@Controller('warehouse/suppliers')
@UseGuards(PoliciesGuard)
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'supplier'))
  async create(
    @Body() createSupplierDto: CreateSupplierDto
  ): Promise<SupplierEntity> {
    const supplier = await this.suppliersService.create(createSupplierDto);

    return new SupplierEntity(supplier);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'supplier'))
  async count(@Query() query: CountSuppliersParamsDto): Promise<number> {
    return await this.suppliersService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplier'))
  async findMany(
    @Query() query: FindManySuppliersParamsDto
  ): Promise<SupplierEntity[]> {
    const suppliers = await this.suppliersService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return suppliers.map((supplier) => new SupplierEntity(supplier));
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supplier'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SupplierEntity | null> {
    const supplier = await this.suppliersService.findUnique({ id });

    return supplier ? new SupplierEntity(supplier) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'supplier'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateSupplierDto: UpdateSupplierDto
  ): Promise<SupplierEntity> {
    const supplier = await this.suppliersService.update(id, updateSupplierDto);

    return new SupplierEntity(supplier);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'supplier'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<SupplierEntity> {
    const supplier = await this.suppliersService.delete(id);

    return new SupplierEntity(supplier);
  }
}

export default SuppliersController;