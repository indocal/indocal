import { NestFactory } from '@nestjs/core';

import { PrismaService } from '@/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 5000);
}

bootstrap();
