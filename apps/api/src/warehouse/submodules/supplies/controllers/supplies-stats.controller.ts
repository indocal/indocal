import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies, Action } from '@/auth';
import { PrismaService } from '@/prisma';

import { SupplyEntity } from '../entities';
import { SupplyPrices } from '../types';

@Controller()
@UseGuards(PoliciesGuard)
export class SuppliesStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('warehouse/supplies/stats/prices')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supply'))
  async suppliesPrices(): Promise<SupplyPrices[]> {
    const supplies = await this.prismaService.supply.findMany({
      include: { orderHistory: true },
    });

    return supplies.map(({ orderHistory, ...supply }) => ({
      supply: new SupplyEntity(supply),
      priceHistory: orderHistory.map((order) => ({
        price: order.price,
        timestamp: order.createdAt.toISOString(),
      })),
    }));
  }

  @Get('warehouse/supplies/:id/stats/prices')
  @CheckPolicies((ability) => ability.can(Action.READ, 'supply'))
  async supplyPrices(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SupplyPrices> {
    const { orderHistory, ...supply } =
      await this.prismaService.supply.findUniqueOrThrow({
        where: { id },
        include: { orderHistory: true },
      });

    return {
      supply: new SupplyEntity(supply),
      priceHistory: orderHistory.map((order) => ({
        price: order.price,
        timestamp: order.createdAt.toISOString(),
      })),
    };
  }
}

export default SuppliesStatsController;
