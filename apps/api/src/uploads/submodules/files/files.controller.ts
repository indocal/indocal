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
import { File, Folder } from '@prisma/client';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { FolderEntity } from '../folders/entities';

import { FileEntity } from './entities';
import {
  FindManyFilesParamsDto,
  CountFilesParamsDto,
  CreateFileDto,
  UpdateFileDto,
} from './dto';

class EnhancedFile extends FileEntity {
  folder: FolderEntity | null;
}

type CreateEnhancedFile = File & {
  folder: Folder | null;
};

@Controller('files')
@UseGuards(PoliciesGuard)
export class FilesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedFile({ folder, ...rest }: CreateEnhancedFile): EnhancedFile {
    const file = new EnhancedFile(rest);
    file.folder = folder ? new FolderEntity(folder) : null;

    return file;
  }

  @Post()
  @CheckPolicies((ability) => ability.can('create', 'file'))
  async create(
    @Body() createFileDto: CreateFileDto
  ): Promise<SingleEntityResponse<EnhancedFile>> {
    const file = await this.prismaService.file.create({
      data: {
        path: createFileDto.path,
        mime: createFileDto.mime,
        extension: createFileDto.extension,
        size: createFileDto.size,
        dimensions: createFileDto.dimensions,
        name: createFileDto.name,
        caption: createFileDto.caption,
        alt: createFileDto.alt,
        ...(createFileDto.folder && {
          folder: { connect: { id: createFileDto.folder } },
        }),
      },
      include: { folder: true },
    });

    return this.createEnhancedFile(file);
  }

  @Get('count')
  @CheckPolicies((ability) => ability.can('count', 'file'))
  async count(@Query() query: CountFilesParamsDto): Promise<number> {
    return await this.prismaService.file.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies((ability) => ability.can('read', 'file'))
  async findMany(
    @Query() query: FindManyFilesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedFile>> {
    const [files, count] = await this.prismaService.$transaction([
      this.prismaService.file.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: { folder: true },
      }),
      this.prismaService.file.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: files.map((file) => this.createEnhancedFile(file)),
    };
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can('read', 'file'))
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFile | null>> {
    const file = await this.prismaService.file.findUnique({
      where: { id },
      include: { folder: true },
    });

    return file ? this.createEnhancedFile(file) : null;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can('update', 'file'))
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateFileDto: UpdateFileDto
  ): Promise<SingleEntityResponse<EnhancedFile>> {
    const file = await this.prismaService.file.update({
      where: { id },
      data: {
        name: updateFileDto.name,
        caption: updateFileDto.caption,
        alt: updateFileDto.alt,
        ...(updateFileDto.folder && {
          folder: { connect: { id: updateFileDto.folder } },
        }),
      },
      include: { folder: true },
    });

    return this.createEnhancedFile(file);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can('delete', 'file'))
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFile>> {
    const file = await this.prismaService.file.delete({
      where: { id },
      include: { folder: true },
    });

    return this.createEnhancedFile(file);
  }
}

export default FilesController;
