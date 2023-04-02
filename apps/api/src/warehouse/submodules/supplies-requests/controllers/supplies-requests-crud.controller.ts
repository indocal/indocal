import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SupplyRequest, SupplyRequestItem, Supply, User } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { SupplyRequestItemEntity } from '../../supplies-requests-items/entities';
import { SupplyEntity } from '../../supplies/entities';
import { UserEntity } from '../../../../auth/submodules/users/entities';

import { SupplyRequestEntity } from '../entities';
import {
  FindManySuppliesRequestsParamsDto,
  CountSuppliesRequestsParamsDto,
  CreateSupplyRequestDto,
} from '../dto';

class EnhancedSupplyRequestItem extends SupplyRequestItemEntity {
  supply: SupplyEntity;
}

class EnhancedSupplyRequest extends SupplyRequestEntity {
  items: EnhancedSupplyRequestItem[];
  requestedBy: UserEntity;
}

type CreateEnhancedSupplyRequest = SupplyRequest & {
  items: (SupplyRequestItem & { supply: Supply })[];
  requestedBy: User;
};

@Controller('warehouse/requests')
@UseGuards(PoliciesGuard)
export class SuppliesRequestsCRUDController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedSupplyRequest({
    items,
    requestedBy,
    ...rest
  }: CreateEnhancedSupplyRequest): EnhancedSupplyRequest {
    const request = new EnhancedSupplyRequest(rest);

    request.items = items.map(({ supply, ...rest }) => {
      const item = new EnhancedSupplyRequestItem(rest);
      item.supply = new SupplyEntity(supply);

      return item;
    });

    request.requestedBy = new UserEntity(requestedBy);

    return request;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'supplyRequest'))
  async create(
    @Body() createSupplyRequestDto: CreateSupplyRequestDto
  ): Promise<SingleEntityResponse<EnhancedSupplyRequest>> {
    const request = await this.prismaService.supplyRequest.create({
      data: {
        description: createSupplyRequestDto.description,
        requestedBy: { connect: { id: createSupplyRequestDto.requestedBy } },
        items: {
          createMany: {
            skipDuplicates: true,
            data: createSupplyRequestDto.items
              .filter((item) => item.quantity > 0)
              .map((item) => ({
                quantity: item.quantity,
                supplyId: item.supply,
              })),
          },
        },
      },
      include: {
        items: { include: { supply: true } },
        requestedBy: true,
      },
    });

    return this.createEnhancedSupplyRequest(request);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'supplyRequest'))
  async count(@Query() query: CountSuppliesRequestsParamsDto): Promise<number> {
    return await this.prismaService.supplyRequest.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'supplyRequest'))
  async findMany(
    @Query() query: FindManySuppliesRequestsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedSupplyRequest>> {
    const [requests, count] = await this.prismaService.$transaction([
      this.prismaService.supplyRequest.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          items: { include: { supply: true } },
          requestedBy: true,
        },
      }),
      this.prismaService.supplyRequest.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: requests.map((request) =>
        this.createEnhancedSupplyRequest(request)
      ),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'supplyRequest'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedSupplyRequest | null>> {
    const request = await this.prismaService.supplyRequest.findUnique({
      where: { id },
      include: {
        items: { include: { supply: true } },
        requestedBy: true,
      },
    });

    return request ? this.createEnhancedSupplyRequest(request) : null;
  }
}

export default SuppliesRequestsCRUDController;
