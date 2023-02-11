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
import { PrismaService } from 'nestjs-prisma';
import { Folder } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { FolderEntity } from './entities';
import {
  FindManyFoldersParamsDto,
  CountFoldersParamsDto,
  CreateFolderDto,
  UpdateFolderDto,
} from './dto';

class EnhancedFolder extends FolderEntity {
  folder: FolderEntity | null;
}

type CreateEnhancedFolder = Folder & {
  folder: Folder | null;
};

@Controller('uploads/folders')
@UseGuards(PoliciesGuard)
export class FoldersController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedFolder({
    folder: root,
    ...rest
  }: CreateEnhancedFolder): EnhancedFolder {
    const folder = new EnhancedFolder(rest);
    folder.folder = root ? new FolderEntity(root) : null;

    return folder;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'folder'))
  async create(
    @Body() createFolderDto: CreateFolderDto
  ): Promise<SingleEntityResponse<EnhancedFolder>> {
    const folder = await this.prismaService.folder.create({
      data: {
        name: createFolderDto.name,
        ...(createFolderDto.folder && {
          folder: { connect: { id: createFolderDto.folder } },
        }),
      },
      include: { folder: true },
    });

    return this.createEnhancedFolder(folder);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'folder'))
  async count(@Query() query: CountFoldersParamsDto): Promise<number> {
    return await this.prismaService.folder.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'folder'))
  async findMany(
    @Query() query: FindManyFoldersParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedFolder>> {
    const [folders, count] = await this.prismaService.$transaction([
      this.prismaService.folder.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { folder: true },
      }),
      this.prismaService.folder.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: folders.map((folder) => this.createEnhancedFolder(folder)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'folder'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFolder | null>> {
    const folder = await this.prismaService.folder.findUnique({
      where: { id },
      include: { folder: true },
    });

    return folder ? this.createEnhancedFolder(folder) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'folder'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFolderDto: UpdateFolderDto
  ): Promise<SingleEntityResponse<EnhancedFolder>> {
    const folder = await this.prismaService.folder.update({
      where: { id },
      data: {
        name: updateFolderDto.name,
        ...(updateFolderDto.folder && {
          folder: { connect: { id: updateFolderDto.folder } },
        }),
      },
      include: { folder: true },
    });

    return this.createEnhancedFolder(folder);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'folder'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFolder>> {
    const folder = await this.prismaService.folder.delete({
      where: { id },
      include: { folder: true },
    });

    return this.createEnhancedFolder(folder);
  }
}

export default FoldersController;
