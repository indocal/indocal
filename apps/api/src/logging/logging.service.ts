import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common';
import { AuthenticatedUser } from '@/auth';

@Injectable()
export class LoggingService {
  constructor(private prismaService: PrismaService) {}

  async log(
    context: string,
    action: string, // method::handler
    user?: AuthenticatedUser | null,
    metadata?: object // { params, body }
  ): Promise<void> {
    await this.prismaService.log.create({
      data: {
        context,
        action,
        ...(user && { user: { connect: { id: user.id } } }),
        ...(metadata && { metadata }),
      },
    });
  }
}

export default LoggingService;
