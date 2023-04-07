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
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { randomUUID } from 'crypto';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';

import { PoliciesGuard } from '../../strategies/attribute-based-access-control';
import { CheckPolicies } from '../../decorators/check-policies.decorator';
import { ApiTokenJwt } from '../../types';

import { ApiTokenEntity } from './entities';
import {
  FindManyApiTokensParamsDto,
  CountApiTokensParamsDto,
  CreateApiTokenDto,
  UpdateApiTokenDto,
} from './dto';

@Controller('auth/api-tokens')
@UseGuards(PoliciesGuard)
export class ApiTokensController {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('create', 'apiToken'),
  })
  async create(
    @Body() createApiTokenDto: CreateApiTokenDto
  ): Promise<SingleEntityResponse<ApiTokenEntity>> {
    const uuid = randomUUID();

    const jwt: ApiTokenJwt = {
      type: 'api-token',
      apiToken: {
        id: uuid,
        name: createApiTokenDto.name,
        description: createApiTokenDto.description,
      },
    };

    const apiToken = await this.prismaService.apiToken.create({
      data: {
        id: uuid,
        name: createApiTokenDto.name,
        description: createApiTokenDto.description,
        type: createApiTokenDto.type,
        token: this.jwtService.sign(jwt),
      },
    });

    return new ApiTokenEntity(apiToken);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('count', 'apiToken'),
  })
  async count(@Query() query: CountApiTokensParamsDto): Promise<number> {
    return await this.prismaService.apiToken.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'apiToken'),
  })
  async findMany(
    @Query() query: FindManyApiTokensParamsDto
  ): Promise<MultipleEntitiesResponse<ApiTokenEntity>> {
    const [apiTokens, count] = await this.prismaService.$transaction([
      this.prismaService.apiToken.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
      }),
      this.prismaService.apiToken.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: apiTokens.map((apiToken) => new ApiTokenEntity(apiToken)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('read', 'apiToken'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<ApiTokenEntity | null>> {
    const apiToken = await this.prismaService.apiToken.findUnique({
      where: { id },
    });

    return apiToken ? new ApiTokenEntity(apiToken) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('update', 'apiToken'),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateApiTokenDto: UpdateApiTokenDto
  ): Promise<SingleEntityResponse<ApiTokenEntity>> {
    const apiToken = await this.prismaService.apiToken.update({
      where: { id },
      data: {
        name: updateApiTokenDto.name,
        description: updateApiTokenDto.description,
        status: updateApiTokenDto.status,
      },
    });

    return new ApiTokenEntity(apiToken);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: false },
    user: (ability) => ability.can('delete', 'apiToken'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<ApiTokenEntity>> {
    const apiToken = await this.prismaService.apiToken.delete({
      where: { id },
    });

    return new ApiTokenEntity(apiToken);
  }
}

export default ApiTokensController;
