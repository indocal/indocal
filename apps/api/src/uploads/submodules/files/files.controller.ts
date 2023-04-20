import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { File, Folder } from '@prisma/client';
import imageSize from 'image-size';
import fs from 'fs';
import path from 'path';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';

import { rootFolder } from '../../config';

import { FolderEntity } from '../folders/entities';

import { FileEntity } from './entities';
import {
  FindManyFilesParamsDto,
  CountFilesParamsDto,
  UploadFilesParamsDto,
  UpdateFileDto,
} from './dto';

class EnhancedFile extends FileEntity {
  folder: FolderEntity | null;
}

type CreateEnhancedFile = File & {
  folder: Folder | null;
};

@Controller('uploads/files')
@UseGuards(PoliciesGuard)
export class FilesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedFile({ folder, ...rest }: CreateEnhancedFile): EnhancedFile {
    const file = new EnhancedFile(rest);
    file.folder = folder ? new FolderEntity(folder) : null;

    return file;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('upload', 'file'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async upload(
    @UploadedFiles() uploads: Array<Express.Multer.File>,
    @Query() query: UploadFilesParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedFile>> {
    const files = await this.prismaService.$transaction(async (tx) => {
      const promises = uploads.map((file) => {
        const location = path.join(rootFolder, file.filename);

        const [mime] = file.mimetype.split('/');

        let width, height;

        if (mime === 'image') {
          const result = imageSize(location);

          if (result) {
            width = result.width;
            height = result.height;
          }
        }

        return tx.file.create({
          data: {
            path: file.path,
            mime: file.mimetype,
            extension: path.extname(file.filename),
            size: file.size,
            name: Buffer.from(file.originalname, 'latin1').toString('utf8'),
            dimensions: width && height ? [width, height] : [],
            ...(query.folder && {
              folder: { connect: { id: query.folder } },
            }),
          },
          include: { folder: true },
        });
      });

      return await Promise.all(promises);
    });

    return {
      count: files.length,
      entities: files.map((file) => this.createEnhancedFile(file)),
    };
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'file'),
  })
  async count(@Query() query: CountFilesParamsDto): Promise<number> {
    return await this.prismaService.file.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'file'),
  })
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
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'file'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFile | null>> {
    const file = await this.prismaService.file.findUnique({
      where: { id },
      include: { folder: true },
    });

    return file ? this.createEnhancedFile(file) : null;
  }

  @Put(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('replace', 'file'),
  })
  @UseInterceptors(FileInterceptor('upload'))
  async replace(
    @Param('id', ParseUUIDPipe) id: UUID,
    @UploadedFile() upload: Express.Multer.File
  ): Promise<SingleEntityResponse<EnhancedFile>> {
    const file = await this.prismaService.$transaction(async (tx) => {
      const file = await tx.file.findUniqueOrThrow({
        where: { id },
        include: { folder: true },
      });

      if (fs.existsSync(path.join(process.cwd(), file.path))) {
        fs.unlinkSync(path.join(process.cwd(), file.path));
      }

      const location = path.join(rootFolder, upload.filename);

      const [mime] = upload.mimetype.split('/');

      let width, height;

      if (mime === 'image') {
        const result = imageSize(location);

        if (result) {
          width = result.width;
          height = result.height;
        }
      }

      return await tx.file.update({
        where: { id },
        data: {
          path: upload.path,
          mime: upload.mimetype,
          extension: path.extname(upload.filename),
          size: upload.size,
          name: Buffer.from(upload.originalname, 'latin1').toString('utf8'),
          dimensions: width && height ? [width, height] : [],
        },
        include: { folder: true },
      });
    });

    return this.createEnhancedFile(file);
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('update', 'file'),
  })
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
        folderId: updateFileDto.folder,
      },
      include: { folder: true },
    });

    return this.createEnhancedFile(file);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('delete', 'file'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedFile>> {
    const file = await this.prismaService.file.delete({
      where: { id },
      include: { folder: true },
    });

    if (fs.existsSync(path.join(process.cwd(), file.path))) {
      fs.unlinkSync(path.join(process.cwd(), file.path));
    }

    return this.createEnhancedFile(file);
  }
}

export default FilesController;
