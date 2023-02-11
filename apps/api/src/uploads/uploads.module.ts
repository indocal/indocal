import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';

import { AuthModule } from '@/auth';

import UploadsController from './uploads.controller';
import UploadsService from './uploads.service';

import { FoldersModule, FilesModule } from './submodules';

@Module({
  imports: [
    AuthModule,
    FoldersModule,
    FilesModule,
    MulterModule.register({
      dest: 'public/uploads',
      storage: diskStorage({
        destination: (_, __, callback) => {
          const folder = path.join(process.cwd(), 'public/uploads');

          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
          }

          callback(null, 'public/uploads');
        },
        filename(_, file, callback) {
          const now = Date.now();
          const ext = path.extname(file.fieldname);

          const filename = `${now}-${file.originalname}${ext}`;

          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, PrismaService],
})
export class UploadsModule {}

export default UploadsModule;
