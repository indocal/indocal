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
import { PrismaService } from 'nestjs-prisma';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

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
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'supplier'),
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto
  ): Promise<SingleEntityResponse<SupplierEntity>> {
    const supplier = await this.prismaService.supplier.create({
      data: {
        name: createSupplierDto.name,
        description: createSupplierDto.description,
      },
    });

    return new SupplierEntity(supplier);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('count', 'supplier'),
  })
  async count(@Query() query: CountSuppliersParamsDto): Promise<number> {
    return await this.prismaService.supplier.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('read', 'supplier'),
  })
  async findMany(
    @Query() query: FindManySuppliersParamsDto
  ): Promise<MultipleEntitiesResponse<SupplierEntity>> {
    const [suppliers, count] = await this.prismaService.$transaction([
      this.prismaService.supplier.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
      }),
      this.prismaService.supplier.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: suppliers.map((supplier) => new SupplierEntity(supplier)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('read', 'supplier'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<SupplierEntity | null>> {
    const supplier = await this.prismaService.supplier.findUnique({
      where: { id },
    });

    return supplier ? new SupplierEntity(supplier) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'supplier'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateSupplierDto: UpdateSupplierDto
  ): Promise<SingleEntityResponse<SupplierEntity>> {
    const supplier = await this.prismaService.supplier.update({
      where: { id },
      data: {
        name: updateSupplierDto.name,
        description: updateSupplierDto.description,
      },
    });

    return new SupplierEntity(supplier);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'supplier'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<SupplierEntity>> {
    const supplier = await this.prismaService.supplier.delete({
      where: { id },
    });

    return new SupplierEntity(supplier);
  }
}

export default SuppliersController;
