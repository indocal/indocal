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

import { SuppliesService, SupplyEntity } from '../supplies';
import { SuppliersService } from '../suppliers';

import OrdersService from './orders.service';
import { OrderEntity } from './entities';
import {
  FindManyOrdersParamsDto,
  CountOrdersParamsDto,
  CreateOrderDto,
  UpdateOrderDto,
} from './dto';

import { OrdersItemsService } from '../orders-items';

@Controller('orders')
@UseGuards(PoliciesGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private ordersItemsService: OrdersItemsService,
    private suppliesService: SuppliesService,
    private suppliersService: SuppliersService
  ) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, 'order'))
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const order = await this.ordersService.create(createOrderDto);
    const items = await this.ordersItemsService.findAll(order);

    const itemsWithSupply = await Promise.all(
      items.map(async (item) => {
        const supply = await this.suppliesService.findUnique({
          id: item.supplyId,
        });

        return supply ? { ...item, supply: new SupplyEntity(supply) } : item;
      })
    );

    const supplier = await this.suppliersService.findUnique({
      id: order.supplierId,
    });

    return new OrderEntity(order, { items: itemsWithSupply, supplier });
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can(Action.COUNT, 'order'))
  async count(@Query() query: CountOrdersParamsDto): Promise<number> {
    return await this.ordersService.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findMany(
    @Query() query: FindManyOrdersParamsDto
  ): Promise<OrderEntity[]> {
    const orders = await this.ordersService.findMany({
      where: query.filters,
      distinct: query.distinct,
      orderBy: query.orderBy,
      skip: query.pagination?.skip && Number(query.pagination.skip),
      take: query.pagination?.take && Number(query.pagination.take),
      cursor: query.pagination?.cursor,
    });

    return await Promise.all(
      orders.map(async (order) => {
        const items = await this.ordersItemsService.findAll(order);

        const itemsWithSupply = await Promise.all(
          items.map(async (item) => {
            const supply = await this.suppliesService.findUnique({
              id: item.supplyId,
            });

            return supply
              ? { ...item, supply: new SupplyEntity(supply) }
              : item;
          })
        );

        const supplier = await this.suppliersService.findUnique({
          id: order.supplierId,
        });

        return new OrderEntity(order, { items: itemsWithSupply, supplier });
      })
    );
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, 'order'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<OrderEntity | null> {
    const order = await this.ordersService.findUnique({ id });
    const items = await this.ordersItemsService.findAll(id);

    const itemsWithSupply = await Promise.all(
      items.map(async (item) => {
        const supply = await this.suppliesService.findUnique({
          id: item.supplyId,
        });

        return supply ? { ...item, supply: new SupplyEntity(supply) } : item;
      })
    );

    const supplier = await this.suppliersService.findUnique({
      id: order?.supplierId,
    });

    return order
      ? new OrderEntity(order, { items: itemsWithSupply, supplier })
      : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, 'order'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<OrderEntity> {
    const order = await this.ordersService.update(id, updateOrderDto);
    const items = await this.ordersItemsService.findAll(order);

    const itemsWithSupply = await Promise.all(
      items.map(async (item) => {
        const supply = await this.suppliesService.findUnique({
          id: item.supplyId,
        });

        return supply ? { ...item, supply: new SupplyEntity(supply) } : item;
      })
    );

    const supplier = await this.suppliersService.findUnique({
      id: order.supplierId,
    });

    return new OrderEntity(order, { items: itemsWithSupply, supplier });
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, 'order'))
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<OrderEntity> {
    const order = await this.ordersService.delete(id);
    const items = await this.ordersItemsService.findAll(order);

    const itemsWithSupply = await Promise.all(
      items.map(async (item) => {
        const supply = await this.suppliesService.findUnique({
          id: item.supplyId,
        });

        return supply ? { ...item, supply: new SupplyEntity(supply) } : item;
      })
    );

    const supplier = await this.suppliersService.findUnique({
      id: order.supplierId,
    });

    return new OrderEntity(order, { items: itemsWithSupply, supplier });
  }
}

export default OrdersController;
