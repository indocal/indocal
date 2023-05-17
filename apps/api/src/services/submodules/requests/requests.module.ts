import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';
import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';

import { AuthModule } from '@/auth';
import { rootFolder } from '@/uploads';

import {
  ServicesRequestsCRUDController,
  ServicesRequestsActionsController,
} from './controllers';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      dest: 'public/uploads',
      storage: diskStorage({
        destination: (_, __, callback) => {
          if (!fs.existsSync(rootFolder)) {
            fs.mkdirSync(rootFolder);
          }

          callback(null, 'public/uploads');
        },
        filename(_, file, callback) {
          const now = Date.now();
          const ext = path.extname(file.originalname);

          const filename = `${now}${ext}`;

          callback(null, filename);
        },
      }),
    }),
  ],
  controllers: [
    ServicesRequestsCRUDController,
    ServicesRequestsActionsController,
  ],
  providers: [PrismaService],
})
export class ServicesRequestsModule {}

export default ServicesRequestsModule;
