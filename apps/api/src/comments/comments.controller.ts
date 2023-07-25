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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { Comment, File, User } from '@prisma/client';
import imageSize from 'image-size';
import path from 'path';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';
import { rootFolder } from '@/uploads';

import { FileEntity } from '../uploads/submodules/files/entities';
import { UserEntity } from '../auth/submodules/users/entities';

import { CommentEntity } from './entities';
import {
  FindManyCommentsParamsDto,
  CountCommentsParamsDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto';

class EnhancedComment extends CommentEntity {
  attachments: FileEntity[];
  author: UserEntity;
}

type CreateEnhancedComment = Comment & {
  attachments: File[];
  author: User;
};

@Controller('comments')
@UseGuards(PoliciesGuard)
export class CommentsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedComment({
    attachments,
    author,
    ...rest
  }: CreateEnhancedComment): EnhancedComment {
    const comment = new EnhancedComment(rest);

    comment.attachments = attachments.map((file) => new FileEntity(file));
    comment.author = new UserEntity(author);

    return comment;
  }

  @Post()
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'comment'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<SingleEntityResponse<EnhancedComment>> {
    const comment = await this.prismaService.$transaction(async (tx) => {
      const isInternal = createCommentDto.isInternal === 'true' ? true : false;

      const comment = await tx.comment.create({
        data: {
          isInternal,
          content: createCommentDto.content,
          author: { connect: { id: createCommentDto.author } },
          [createCommentDto.attach.model]: {
            connect: { id: createCommentDto.attach.entity },
          },
        },
        include: {
          attachments: true,
          author: true,
        },
      });

      for await (const attachment of attachments) {
        const location = path.join(rootFolder, attachment.filename);

        const [mime] = attachment.mimetype.split('/');

        let width, height;

        if (mime === 'image') {
          const result = imageSize(location);

          if (result) {
            width = result.width;
            height = result.height;
          }
        }

        const filename = Buffer.from(
          attachment.originalname,
          'latin1'
        ).toString('utf8');

        await tx.file.create({
          data: {
            path: attachment.path,
            mime: attachment.mimetype,
            extension: path.extname(attachment.filename),
            size: attachment.size,
            name: filename,
            dimensions: width && height ? [width, height] : [],
            comment: { connect: { id: comment.id } },
          },
        });
      }

      const updated = await tx.comment.findUniqueOrThrow({
        where: { id: comment.id },
        include: { attachments: true, author: true },
      });

      return updated;
    });

    return this.createEnhancedComment(comment);
  }

  @Get('count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'comment'),
  })
  async count(@Query() query: CountCommentsParamsDto): Promise<number> {
    return await this.prismaService.comment.count({
      where: query.filters,
      distinct: query.distinct,
    });
  }

  @Get()
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'comment'),
  })
  async findMany(
    @Query() query: FindManyCommentsParamsDto
  ): Promise<MultipleEntitiesResponse<EnhancedComment>> {
    const [comments, count] = await this.prismaService.$transaction([
      this.prismaService.comment.findMany({
        where: query.filters,
        distinct: query.distinct,
        orderBy: query.orderBy,
        skip: query.pagination?.skip && Number(query.pagination.skip),
        take: query.pagination?.take && Number(query.pagination.take),
        cursor: query.pagination?.cursor,
        include: {
          attachments: true,
          author: true,
        },
      }),
      this.prismaService.comment.count({
        where: query.filters,
        distinct: query.distinct,
      }),
    ]);

    return {
      count,
      entities: comments.map((comment) => this.createEnhancedComment(comment)),
    };
  }

  @Get(':id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'comment'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedComment | null>> {
    const comment = await this.prismaService.comment.findUnique({
      where: { id },
      include: {
        attachments: true,
        author: true,
      },
    });

    return comment ? this.createEnhancedComment(comment) : null;
  }

  @Patch(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'comment'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateCommentDto: UpdateCommentDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<SingleEntityResponse<EnhancedComment>> {
    const comment = await this.prismaService.$transaction(async (tx) => {
      const isInternal = updateCommentDto.isInternal === 'true' ? true : false;

      const comment = await tx.comment.update({
        where: { id },
        data: {
          isInternal,
          content: updateCommentDto.content,
        },
        include: {
          attachments: true,
          author: true,
        },
      });

      await tx.file.deleteMany({ where: { comment: { id: comment.id } } });

      for await (const attachment of attachments) {
        const location = path.join(rootFolder, attachment.filename);

        const [mime] = attachment.mimetype.split('/');

        let width, height;

        if (mime === 'image') {
          const result = imageSize(location);

          if (result) {
            width = result.width;
            height = result.height;
          }
        }

        const filename = Buffer.from(
          attachment.originalname,
          'latin1'
        ).toString('utf8');

        await tx.file.create({
          data: {
            path: attachment.path,
            mime: attachment.mimetype,
            extension: path.extname(attachment.filename),
            size: attachment.size,
            name: filename,
            dimensions: width && height ? [width, height] : [],
            comment: { connect: { id: comment.id } },
          },
        });
      }

      const updated = await tx.comment.findUniqueOrThrow({
        where: { id: comment.id },
        include: { attachments: true, author: true },
      });

      return updated;
    });

    return this.createEnhancedComment(comment);
  }

  @Delete(':id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'comment'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedComment>> {
    const comment = await this.prismaService.comment.delete({
      where: { id },
      include: {
        attachments: true,
        author: true,
      },
    });

    return this.createEnhancedComment(comment);
  }
}

export default CommentsController;
