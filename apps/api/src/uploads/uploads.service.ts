import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';
import fs from 'fs';
import path from 'path';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(private prismaService: PrismaService) {}

  @Cron('0 0 1 * *')
  async cleanup() {
    const filenames = fs.readdirSync(
      path.join(process.cwd(), 'public/uploads')
    );

    for await (const filename of filenames) {
      const file = await this.prismaService.file.findUnique({
        where: { path: path.join('public/uploads', filename) },
      });

      if (!file) {
        fs.rmSync(path.join(process.cwd(), 'public/uploads', filename));
      }
    }

    this.logger.debug('Called every 10 seconds');
  }
}

export default UploadsService;
