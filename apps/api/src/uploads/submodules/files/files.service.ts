import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'nestjs-prisma';
import fs from 'fs';
import path from 'path';

import { rootFolder } from '../../config';

@Injectable()
export class FilesService {
  constructor(private prismaService: PrismaService) {}

  @Cron('0 0 * * *')
  async cleanup(): Promise<void> {
    if (!fs.existsSync(rootFolder)) return;

    const startsAt = Date.now();

    const logger = new Logger(FilesService.name);

    const uploads = fs.readdirSync(rootFolder);

    const files = await this.prismaService.file.findMany({
      select: { path: true },
    });

    uploads
      .filter((upload) => !files.find((file) => file.path.includes(upload)))
      .forEach((upload) => {
        fs.unlinkSync(path.join(rootFolder, upload));
      });

    const duration = '\x1b[33m' + `+${Date.now() - startsAt}ms`;

    logger.log(`(Scheduler) -> ${this.cleanup.name} ${duration}`);
  }
}

export default FilesService;
