import {
  Controller,
  Get,
  Put,
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
import { ServiceCertificateTemplate, Service, File } from '@prisma/client';
import imageSize from 'image-size';
import path from 'path';

import { UUID, SingleEntityResponse } from '@/common';
import { PoliciesGuard, CheckPolicies } from '@/auth';
import { rootFolder } from '@/uploads';

import { FileEntity } from '../../../uploads/submodules/files/entities';

import { ServiceEntity } from '../../entities';

import {
  ServiceCertificateTemplateEntity,
  ServiceCertificateTemplateLayoutOrientation,
} from './entities';
import { UpsertServiceCertificateTemplateDto } from './dto';

class EnhancedServiceCertificateTemplate extends ServiceCertificateTemplateEntity {
  assets: FileEntity[];
  service: ServiceEntity;
}

type CreateEnhancedServiceCertificateTemplate = ServiceCertificateTemplate & {
  assets: File[];
  service: Service;
};

@Controller()
@UseGuards(PoliciesGuard)
export class ServicesCertificatesTemplatesController {
  constructor(private prismaService: PrismaService) {}

  createEnhancedServiceCertificateTemplate({
    assets,
    service,
    ...rest
  }: CreateEnhancedServiceCertificateTemplate): EnhancedServiceCertificateTemplate {
    const template = new EnhancedServiceCertificateTemplate(rest);

    template.assets = assets.map((asset) => new FileEntity(asset));

    template.service = new ServiceEntity(service);

    return template;
  }

  @Get('services/templates/:id')
  @CheckPolicies({
    apiToken: { ANON: true, SERVICE: true },
    user: (ability) => ability.can('read', 'service'),
  })
  async findOneByUUID(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate | null>> {
    const template =
      await this.prismaService.serviceCertificateTemplate.findUnique({
        where: { id },
        include: { service: true, assets: true },
      });

    return template
      ? this.createEnhancedServiceCertificateTemplate(template)
      : null;
  }

  @Put('services/:service_id/templates')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('create', 'service'),
  })
  @UseInterceptors(AnyFilesInterceptor())
  async upsert(
    @Param('service_id') serviceId: UUID,
    @Body() upsertTemplateDto: UpsertServiceCertificateTemplateDto,
    @UploadedFiles() assets: Array<Express.Multer.File>
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate>> {
    const template = await this.prismaService.$transaction(async (tx) => {
      const template = await tx.serviceCertificateTemplate.upsert({
        where: { serviceId },
        create: {
          serviceId,
          layout: {
            orientation:
              upsertTemplateDto.layout ||
              ServiceCertificateTemplateLayoutOrientation.PORTRAIT,
          },

          content: upsertTemplateDto.content,
          styles: upsertTemplateDto.styles,
          placeholders: upsertTemplateDto.placeholders || [],
        },
        update: {
          layout: upsertTemplateDto.layout,
          content: upsertTemplateDto.content,
          styles: upsertTemplateDto.styles,
          placeholders: upsertTemplateDto.placeholders || [],
        },
        include: { service: true, assets: true },
      });

      for await (const asset of assets) {
        const location = path.join(rootFolder, asset.filename);

        const [mime] = asset.mimetype.split('/');

        let width, height;

        if (mime === 'image') {
          const result = imageSize(location);

          if (result) {
            width = result.width;
            height = result.height;
          }
        }

        await tx.file.create({
          data: {
            path: asset.path,
            mime: asset.mimetype,
            extension: path.extname(asset.filename),
            size: asset.size,
            name: Buffer.from(asset.originalname, 'latin1').toString('utf8'),
            dimensions: width && height ? [width, height] : [],
            templates: { connect: { id: template.id } },
          },
        });
      }

      const updated = await tx.serviceCertificateTemplate.findUniqueOrThrow({
        where: { id: template.id },
        include: { service: true, assets: true },
      });

      return updated;
    });

    return this.createEnhancedServiceCertificateTemplate(template);
  }

  @Delete('services/templates/:id')
  @CheckPolicies({
    apiToken: { ANON: false, SERVICE: true },
    user: (ability) => ability.can('delete', 'service'),
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: UUID
  ): Promise<SingleEntityResponse<EnhancedServiceCertificateTemplate>> {
    const template = await this.prismaService.serviceCertificateTemplate.delete(
      {
        where: { id },
        include: { service: true, assets: true },
      }
    );

    return this.createEnhancedServiceCertificateTemplate(template);
  }
}

export default ServicesCertificatesTemplatesController;
