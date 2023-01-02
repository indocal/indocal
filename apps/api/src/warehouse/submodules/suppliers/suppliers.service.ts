import { Injectable } from '@nestjs/common';
import { Prisma, Supplier as DBSupplierModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateSupplierDto, UpdateSupplierDto } from './dto';

@Injectable()
export class SuppliersService {
  constructor(private prismaService: PrismaService) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<DBSupplierModel> {
    return await this.prismaService.supplier.create({
      data: {
        name: createSupplierDto.name,
        description: createSupplierDto.description,
      },
    });
  }

  async count(params: Prisma.SupplierCountArgs): Promise<number> {
    return await this.prismaService.supplier.count(params);
  }

  async findMany(
    params: Prisma.SupplierFindManyArgs
  ): Promise<DBSupplierModel[]> {
    return await this.prismaService.supplier.findMany(params);
  }

  async findUnique(
    input: Prisma.SupplierWhereUniqueInput
  ): Promise<DBSupplierModel | null> {
    return await this.prismaService.supplier.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateSupplierDto: UpdateSupplierDto
  ): Promise<DBSupplierModel> {
    return await this.prismaService.supplier.update({
      where: { id },
      data: {
        name: updateSupplierDto.name,
        description: updateSupplierDto.description,
      },
    });
  }

  async delete(id: UUID): Promise<DBSupplierModel> {
    return await this.prismaService.supplier.delete({ where: { id } });
  }
}

export default SuppliersService;
