import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from 'nestjs-prisma';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useStaticAssets('public', { prefix: '/public' });
  app.setGlobalPrefix('api');

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 5000);
}

bootstrap();
