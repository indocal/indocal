import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SupplyRequestItem, Supply, SupplyRequest } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { SupplyEntity } from '../supplies/entities';
import { SupplyRequestEntity } from '../supplies-requests/entities';

import { SupplyRequestItemEntity } from './entities';

class EnhancedSupplyRequestItem extends SupplyRequestItemEntity {
  supply: SupplyEntity;
  request: SupplyRequestEntity;
}

type CreateEnhancedSupplyRequestItem = SupplyRequestItem & {
  supply: Supply;
  request: SupplyRequest;
};

@Controller()
@UseGuards(PoliciesGuard)
export class SuppliesRequestsItemsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedSupplyRequestItem({
    request,
    supply,
    ...rest
  }: CreateEnhancedSupplyRequestItem): EnhancedSupplyRequestItem {
    const item = new EnhancedSupplyRequestItem(rest);
    item.supply = new SupplyEntity(supply);
    item.request = new SupplyRequestEntity(request);

    return item;
  }

  @Get('warehouse/requests/:request_id/items/count')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('count', 'supplyRequest'),
  })
  async count(@Param('request_id') requestId: UUID): Promise<number> {
    return await this.prismaService.supplyRequestItem.count({
      where: { request: { id: requestId } },
    });
  }

  @Get('warehouse/requests/:request_id/items')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('read', 'supplyRequest'),
  })
  async findAll(
    @Param('request_id') requestId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedSupplyRequestItem>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.supplyRequestItem.findMany({
        where: { request: { id: requestId } },
        include: { request: true, supply: true },
      }),
      this.prismaService.supplyRequestItem.count({
        where: { request: { id: requestId } },
      }),
    ]);

    return {
      count,
      entities: items.map((item) => this.createEnhancedSupplyRequestItem(item)),
    };
  }

  @Get('warehouse/requests/items/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('read', 'supplyRequest'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedSupplyRequestItem | null>> {
    const item = await this.prismaService.supplyRequestItem.findUnique({
      where: { id },
      include: { request: true, supply: true },
    });

    return item ? this.createEnhancedSupplyRequestItem(item) : null;
  }
}

export default SuppliesRequestsItemsController;
