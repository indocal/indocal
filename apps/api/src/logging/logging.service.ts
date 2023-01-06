import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthenticatedUser } from '@/auth';

import { LogMetadata } from './entities';

export type CreateLogArgs = {
  context: string;
  action: string; // method::handler
  user: AuthenticatedUser | null;
  metadata: LogMetadata;
};

@Injectable()
export class LoggingService {
  constructor(private prismaService: PrismaService) {}

  async log({ context, action, user, metadata }: CreateLogArgs): Promise<void> {
    await this.prismaService.log.create({
      data: {
        context,
        action,
        metadata,
        ...(user && { user: { connect: { id: user.id } } }),
      },
    });
  }
}

export default LoggingService;
