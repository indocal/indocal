import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Order as DBOrderModel,
  OrderItem as DBOrderItemModel,
} from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateOrderItemDto, UpdateOrderItemDto } from './dto';

@Injectable()
export class OrdersItemsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    order: UUID | DBOrderModel,
    createOrderItemDto: CreateOrderItemDto
  ): Promise<DBOrderItemModel> {
    return await this.prismaService.orderItem.create({
      data: {
        price: createOrderItemDto.price,
        quantity: createOrderItemDto.quantity,
        supply: { connect: { id: createOrderItemDto.supply } },
        order: {
          connect: { id: typeof order === 'string' ? order : order.id },
        },
      },
    });
  }

  async count(order: UUID | DBOrderModel): Promise<number> {
    return await this.prismaService.orderItem.count({
      where: { order: { id: typeof order === 'string' ? order : order.id } },
    });
  }

  async findAll(order: UUID | DBOrderModel): Promise<DBOrderItemModel[]> {
    return await this.prismaService.orderItem.findMany({
      where: { order: { id: typeof order === 'string' ? order : order.id } },
    });
  }

  async findUnique(
    input: Prisma.OrderItemWhereUniqueInput
  ): Promise<DBOrderItemModel | null> {
    return await this.prismaService.orderItem.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateOrderItemDto: UpdateOrderItemDto
  ): Promise<DBOrderItemModel> {
    return await this.prismaService.orderItem.update({
      where: { id },
      data: {
        price: updateOrderItemDto.price,
        quantity: updateOrderItemDto.quantity,
        received: updateOrderItemDto.received,
      },
    });
  }

  async delete(id: UUID): Promise<DBOrderItemModel> {
    return await this.prismaService.orderItem.delete({ where: { id } });
  }
}

export default OrdersItemsService;
