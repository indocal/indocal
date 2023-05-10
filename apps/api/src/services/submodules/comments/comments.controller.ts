import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import {
  ServiceRequestComment,
  ServiceRequest,
  File,
  User,
} from '@prisma/client';
import imageSize from 'image-size';
import path from 'path';

import { UUID, SingleEntityResponse, MultipleEntitiesResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';
import { rootFolder } from '@/uploads';

import { FileEntity } from '../../../uploads/submodules/files/entities';
import { UserEntity } from '../../../auth/submodules/users/entities';
import { ServiceRequestEntity } from '../requests/entities';

import { ServiceRequestCommentEntity } from './entities';
import {
  CreateServiceRequestCommentDto,
  UpdateServiceRequestCommentDto,
} from './dto';

class EnhancedServiceRequestComment extends ServiceRequestCommentEntity {
  attachments: FileEntity[];
  author: UserEntity;
  request: ServiceRequestEntity;
}

type CreateEnhancedServiceRequestComment = ServiceRequestComment & {
  attachments: File[];
  author: User;
  request: ServiceRequest;
};

@Controller()
@UseGuards(PoliciesGuard)
export class ServicesRequestsCommentsController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceRequestComment({
    attachments,
    author,
    request,
    ...rest
  }: CreateEnhancedServiceRequestComment): EnhancedServiceRequestComment {
    const comment = new EnhancedServiceRequestComment(rest);

    comment.attachments = attachments.map((file) => new FileEntity(file));
    comment.author = new UserEntity(author);
    comment.request = new ServiceRequestEntity(request);

    return comment;
  }

  @Post('requests/:request_id/comments')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'serviceRequest'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Param('request_id') requestId: UUID,
    @Body() createCommentDto: CreateServiceRequestCommentDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<SingleEntityResponse<EnhancedServiceRequestComment>> {
    const comment = await this.prismaService.serviceRequestComment.create({
      data: {
        content: createCommentDto.content,
        isInternal: Boolean(createCommentDto.isInternal),
        author: { connect: { id: createCommentDto.author } },
        request: { connect: { id: requestId } },

        ...(attachments.length && {
          attachments: {
            createMany: {
              skipDuplicates: true,
              data: attachments.map((attachment) => {
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

                return {
                  path: attachment.path,
                  mime: attachment.mimetype,
                  extension: path.extname(attachment.filename),
                  size: attachment.size,
                  name: Buffer.from(attachment.originalname, 'latin1').toString(
                    'utf8'
                  ),
                  dimensions: width && height ? [width, height] : [],
                };
              }),
            },
          },
        }),
      },
      include: {
        attachments: true,
        author: true,
        request: true,
      },
    });

    return this.createEnhancedServiceRequestComment(comment);
  }

  @Get('requests/:request_id/comments/count')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('count', 'serviceRequest'),
  })
  async count(@Param('request_id') requestId: UUID): Promise<number> {
    return await this.prismaService.serviceRequestComment.count({
      where: { request: { id: requestId } },
    });
  }

  @Get('requests/:request_id/comments')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceRequest'),
  })
  async findAll(
    @Param('request_id') requestId: UUID
  ): Promise<MultipleEntitiesResponse<EnhancedServiceRequestComment>> {
    const [comments, count] = await this.prismaService.$transaction([
      this.prismaService.serviceRequestComment.findMany({
        where: { request: { id: requestId } },
        include: {
          attachments: true,
          author: true,
          request: true,
        },
      }),
      this.prismaService.serviceRequestComment.count({
        where: { request: { id: requestId } },
      }),
    ]);

    return {
      count,
      entities: comments.map((comment) =>
        this.createEnhancedServiceRequestComment(comment)
      ),
    };
  }

  @Get('requests/comments/:id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'serviceRequest'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceRequestComment | null>> {
    const comment = await this.prismaService.serviceRequestComment.findUnique({
      where: { id },
      include: {
        attachments: true,
        author: true,
        request: true,
      },
    });

    return comment ? this.createEnhancedServiceRequestComment(comment) : null;
  }

  @Patch('requests/comments/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'serviceRequest'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateCommentDto: UpdateServiceRequestCommentDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<SingleEntityResponse<EnhancedServiceRequestComment>> {
    const comment = await this.prismaService.$transaction(async (tx) => {
      const comment = await tx.serviceRequestComment.findUniqueOrThrow({
        where: { id },
        include: { attachments: true },
      });

      return await tx.serviceRequestComment.update({
        where: { id },
        data: {
          content: updateCommentDto.content,
          isInternal: Boolean(updateCommentDto.isInternal),

          ...(attachments.length > 0 && {
            attachments: {
              deleteMany: comment.attachments.map(({ id }) => ({ id })),
              createMany: {
                skipDuplicates: true,
                data: attachments.map((attachment) => {
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

                  return {
                    path: attachment.path,
                    mime: attachment.mimetype,
                    extension: path.extname(attachment.filename),
                    size: attachment.size,
                    name: Buffer.from(
                      attachment.originalname,
                      'latin1'
                    ).toString('utf8'),
                    dimensions: width && height ? [width, height] : [],
                  };
                }),
              },
            },
          }),
        },
        include: {
          attachments: true,
          author: true,
          request: true,
        },
      });
    });

    return this.createEnhancedServiceRequestComment(comment);
  }

  @Delete('requests/comments/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'serviceRequest'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceRequestComment>> {
    const comment = await this.prismaService.serviceRequestComment.delete({
      where: { id },
      include: {
        attachments: true,
        author: true,
        request: true,
      },
    });

    return this.createEnhancedServiceRequestComment(comment);
  }
}

export default ServicesRequestsCommentsController;
