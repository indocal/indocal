import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { UUID } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { SupplyEntity } from '../entities';
import { SupplyPrices } from '../types';

@Controller()
@UseGuards(PoliciesGuard)
export class SuppliesStatsController {
  constructor(private prismaService: PrismaService) {}

  @Get('warehouse/supplies/stats/prices')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('get-prices', 'supply'),
  })
  async suppliesPrices(): Promise<SupplyPrices[]> {
    const supplies = await this.prismaService.supply.findMany({
      include: { orderHistory: { orderBy: { createdAt: 'asc' } } },
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
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('get-prices', 'supply'),
  })
  async supplyPrices(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SupplyPrices> {
    const { orderHistory, ...supply } =
      await this.prismaService.supply.findUniqueOrThrow({
        where: { id },
        include: { orderHistory: { orderBy: { createdAt: 'asc' } } },
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
