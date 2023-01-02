import { Injectable } from '@nestjs/common';
import { Prisma, Supply as DBSupplyModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateSupplyDto, UpdateSupplyDto } from './dto';

@Injectable()
export class SuppliesService {
  constructor(private prismaService: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto): Promise<DBSupplyModel> {
    return await this.prismaService.supply.create({
      data: {
        code: createSupplyDto.code,
        name: createSupplyDto.name,
        description: createSupplyDto.description,
        quantity: createSupplyDto.quantity,
        unit: createSupplyDto.unit,
      },
    });
  }

  async count(params: Prisma.SupplyCountArgs): Promise<number> {
    return await this.prismaService.supply.count(params);
  }

  async findMany(params: Prisma.SupplyFindManyArgs): Promise<DBSupplyModel[]> {
    return await this.prismaService.supply.findMany(params);
  }

  async findUnique(
    input: Prisma.SupplyWhereUniqueInput
  ): Promise<DBSupplyModel | null> {
    return await this.prismaService.supply.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateSupplyDto: UpdateSupplyDto
  ): Promise<DBSupplyModel> {
    return await this.prismaService.supply.update({
      where: { id },
      data: {
        code: updateSupplyDto.code,
        name: updateSupplyDto.name,
        description: updateSupplyDto.description,
        quantity: updateSupplyDto.quantity,
        unit: updateSupplyDto.unit,
      },
    });
  }

  async delete(id: UUID): Promise<DBSupplyModel> {
    return await this.prismaService.supply.delete({ where: { id } });
  }
}

export default SuppliesService;
