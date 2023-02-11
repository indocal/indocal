import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import path from 'path';
import { imageSize } from 'image-size';

import { PoliciesGuard, CheckPolicies } from '@/auth';

@Controller('uploads')
@UseGuards(PoliciesGuard)
export class UploadsController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @CheckPolicies((ability) => ability.can('create', 'file'))
  async upload(
    @UploadedFiles() uploads: Array<Express.Multer.File>
  ): Promise<void> {
    await this.prismaService.file.createMany({
      skipDuplicates: true,
      data: uploads.map((file) => {
        const location = path.join(process.cwd(), file.path);

        const { width, height } = imageSize(location);

        return {
          path: file.path,
          mime: file.mimetype,
          extension: path.extname(file.filename),
          size: file.size,
          name: file.originalname,
          dimensions: width && height ? [width, height] : [],
        };
      }),
    });
  }
}

export default UploadsController;
