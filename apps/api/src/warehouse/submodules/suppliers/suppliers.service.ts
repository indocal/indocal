import { Injectable } from '@nestjs/common';
import { Prisma, Supplier as DBWarehouseSupplierModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateWarehouseSupplierDto, UpdateWarehouseSupplierDto } from './dto';

@Injectable()
export class WarehouseSuppliersService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createWarehouseSupplierDto: CreateWarehouseSupplierDto
  ): Promise<DBWarehouseSupplierModel> {
    return await this.prismaService.supplier.create({
      data: {
        name: createWarehouseSupplierDto.name,
        description: createWarehouseSupplierDto.description,
      },
    });
  }

  async count(params: Prisma.SupplierCountArgs): Promise<number> {
    return await this.prismaService.supplier.count(params);
  }

  async findMany(
    params: Prisma.SupplierFindManyArgs
  ): Promise<DBWarehouseSupplierModel[]> {
    return await this.prismaService.supplier.findMany(params);
  }

  async findUnique(
    input: Prisma.SupplierWhereUniqueInput
  ): Promise<DBWarehouseSupplierModel | null> {
    return await this.prismaService.supplier.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateWarehouseSupplierDto: UpdateWarehouseSupplierDto
  ): Promise<DBWarehouseSupplierModel> {
    return await this.prismaService.supplier.update({
      where: { id },
      data: {
        name: updateWarehouseSupplierDto.name,
        description: updateWarehouseSupplierDto.description,
      },
    });
  }

  async delete(id: UUID): Promise<DBWarehouseSupplierModel> {
    return await this.prismaService.supplier.delete({ where: { id } });
  }
}

export default WarehouseSuppliersService;
