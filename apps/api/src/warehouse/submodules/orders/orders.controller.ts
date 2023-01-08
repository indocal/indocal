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
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { SupplyEntity, SupplierEntity } from '@/warehouse';
import { OrderItemEntity } from '../orders-items'; // Error if it's imported from @/warehouse
import { PrismaService } from '@/prisma';

import { OrderEntity } from './entities';
import {
  FindManyOrdersParamsDto,
  CountOrdersParamsDto,
  CreateOrderDto,
  UpdateOrderDto,
} from './dto';

class EnhancedOrderItem extends OrderItemEntity {
  supply: SupplyEntity;
}

class EnhancedOrder extends OrderEntity {
  items: EnhancedOrderItem[];
  supplier: SupplierEntity;
}

@Controller('warehouse/orders')
@UseGuards(PoliciesGuard)
export class OrdersController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'order'))
  async create(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const { items, supplier, ...rest } = await this.prismaService.order.create({
      data: {
        code: createOrderDto.code,
        supplier: { connect: { id: createOrderDto.supplier } },
      },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    const order = new EnhancedOrder(rest);

    order.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedOrderItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    order.supplier = new SupplierEntity(supplier);

    return order;
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'order'))
  async count(@Query() query: CountOrdersParamsDto): Promise<number> {
    return await this.prismaService.order.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findMany(
    @Query() query: FindManyOrdersParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedOrder>> {
    const [orders, count] = await this.prismaService.$transaction([
      this.prismaService.order.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { items: { include: { supply: true } }, supplier: true },
      }),
      this.prismaService.order.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: orders.map(({ items, supplier, ...rest }) => {
        const order = new EnhancedOrder(rest);

        order.items = items.map(({ supply, ...rest }) => {
          const item = new EnhancedOrderItem(rest);
          item.supply = new SupplyEntity(supply);

          return item;
        });

        order.supplier = new SupplierEntity(supplier);

        return order;
      }),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder | null>> {
    const response = await this.prismaService.order.findUnique({
      where: { id },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    if (response) {
      const { items, supplier, ...rest } = response;

      const order = new EnhancedOrder(rest);

      order.items = items.map(({ supply, ...rest }) => {
        const item = new EnhancedOrderItem(rest);
        item.supply = new SupplyEntity(supply);

        return item;
      });

      order.supplier = new SupplierEntity(supplier);

      return order;
    }
    return null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'order'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const { items, supplier, ...rest } = await this.prismaService.order.update({
      where: { id },
      data: {
        code: updateOrderDto.code,
        status: updateOrderDto.status,
      },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    const order = new EnhancedOrder(rest);

    order.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedOrderItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    order.supplier = new SupplierEntity(supplier);

    return order;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'order'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedOrder>> {
    const { items, supplier, ...rest } = await this.prismaService.order.delete({
      where: { id },
      include: { items: { include: { supply: true } }, supplier: true },
    });

    const order = new EnhancedOrder(rest);

    order.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedOrderItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    order.supplier = new SupplierEntity(supplier);

    return order;
  }
}

export default OrdersController;
