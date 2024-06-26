import {
  Controller,
  Patch,
  Body,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import imageSize from 'image-size';
import path from 'path';

import { PoliciesGuard, CheckPolicies } from '@/auth';
import { rootFolder } from '@/uploads';

import { InvalidCurrentStepException } from '../../../errors';

import { ServiceRequestTracking } from '../entities';
import { ApproveOrRejectCurrentStepDto } from '../dto';

@Controller('requests/actions')
@UseGuards(PoliciesGuard)
export class ServicesRequestsActionsController {
  constructor(private prismaService: PrismaService) {}

  @Patch('approve-or-reject-current-step')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('update', 'serviceRequest'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async approveOrRejectCurrentStep(
    @Body() approveOrRejectCurrentStepDto: ApproveOrRejectCurrentStepDto,
    @UploadedFiles() attachments: Array<Express.Multer.File>
  ): Promise<void> {
    await this.prismaService.$transaction(async (tx) => {
      const request = await tx.serviceRequest.findUniqueOrThrow({
        where: { id: approveOrRejectCurrentStepDto.request },
        include: {
          currentStep: {
            include: {
              nextStepOnApprove: true,
              nextStepOnReject: true,
            },
          },
        },
      });

      const nextStep =
        approveOrRejectCurrentStepDto.action === 'APPROVE'
          ? request?.currentStep?.nextStepOnApprove
          : request?.currentStep?.nextStepOnReject;

      if (!nextStep) throw new InvalidCurrentStepException();

      if (approveOrRejectCurrentStepDto.comment) {
        const isInternal =
          approveOrRejectCurrentStepDto.comment.isInternal === 'true'
            ? true
            : false;

        const comment = await tx.comment.create({
          data: {
            isInternal,
            content: approveOrRejectCurrentStepDto.comment.content,
            author: {
              connect: {
                id: approveOrRejectCurrentStepDto.comment.author,
              },
            },
            request: { connect: { id: request.id } },
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
      }

      const tracking = request.tracking as ServiceRequestTracking[];

      const lastTrack = tracking.pop();

      await tx.serviceRequest.update({
        where: { id: request.id },
        data: {
          status: nextStep.nextRequestStatus,
          currentStep: { connect: { id: nextStep.id } },
          tracking: lastTrack
            ? tracking.concat(
                {
                  step: lastTrack.step,
                  startedAt: lastTrack.startedAt,
                  endedAt: new Date().toISOString(),
                },
                {
                  step: {
                    id: nextStep.id,
                    title: nextStep.title,
                    description: nextStep.description,
                  },
                  startedAt: new Date().toISOString(),
                  endedAt: null,
                }
              )
            : tracking.concat({
                step: {
                  id: nextStep.id,
                  title: nextStep.title,
                  description: nextStep.description,
                },
                startedAt: new Date().toISOString(),
                endedAt: null,
              }),
        },
      });
    });
  }
}

export default ServicesRequestsActionsController;
