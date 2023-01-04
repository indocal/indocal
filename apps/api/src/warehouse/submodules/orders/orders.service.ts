import { Injectable } from '@nestjs/common';
import { Prisma, Order as DBOrderModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<DBOrderModel> {
    return await this.prismaService.order.create({
      data: {
        code: createOrderDto.code,
        supplier: { connect: { id: createOrderDto.supplier } },
      },
    });
  }

  async count(params: Prisma.OrderCountArgs): Promise<number> {
    return await this.prismaService.order.count(params);
  }

  async findMany(params: Prisma.OrderFindManyArgs): Promise<DBOrderModel[]> {
    return await this.prismaService.order.findMany(params);
  }

  async findUnique(
    input: Prisma.OrderWhereUniqueInput
  ): Promise<DBOrderModel | null> {
    return await this.prismaService.order.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateOrderDto: UpdateOrderDto
  ): Promise<DBOrderModel> {
    return await this.prismaService.order.update({
      where: { id },
      data: {
        code: updateOrderDto.code,
        status: updateOrderDto.status,
      },
    });
  }

  async delete(id: UUID): Promise<DBOrderModel> {
    return await this.prismaService.order.delete({ where: { id } });
  }
}

export default OrdersService;
