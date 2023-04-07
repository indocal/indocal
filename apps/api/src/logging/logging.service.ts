import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { JWT } from '@/auth';

import { LogMetadata } from './entities';

export type CreateLogArgs = {
  context: string;
  action: string; // method::handler
  jwt: JWT | null;
  metadata: LogMetadata;
};

@Injectable()
export class LoggingService {
  constructor(private prismaService: PrismaService) {}

  async log({ context, action, jwt, metadata }: CreateLogArgs): Promise<void> {
    switch (jwt?.type) {
      case 'api-token': {
        await this.prismaService.log.create({
          data: {
            context,
            action,
            metadata,
            apiToken: { connect: { id: jwt.apiToken.id } },
          },
        });
        break;
      }

      case 'user': {
        await this.prismaService.log.create({
          data: {
            context,
            action,
            metadata,
            user: { connect: { id: jwt.user.id } },
          },
        });
        break;
      }

      default: {
        await this.prismaService.log.create({
          data: {
            context,
            action,
            metadata,
          },
        });
        break;
      }
    }
  }
}

export default LoggingService;
