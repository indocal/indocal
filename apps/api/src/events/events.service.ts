import { Injectable } from '@nestjs/common';
import { Prisma, Event as DBEventModel } from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateEventDto, UpdateEventDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<DBEventModel> {
    return await this.prismaService.event.create({
      data: {
        slug: createEventDto.slug,
        title: createEventDto.title,
        description: createEventDto.description,
        scheduledAt: createEventDto.scheduledAt,
      },
    });
  }

  async count(params: Prisma.EventCountArgs): Promise<number> {
    return await this.prismaService.event.count(params);
  }

  async findMany(params: Prisma.EventFindManyArgs): Promise<DBEventModel[]> {
    return await this.prismaService.event.findMany(params);
  }

  async findUnique(
    identifier: keyof Prisma.EventWhereUniqueInput,
    input: string
  ): Promise<DBEventModel | null> {
    return await this.prismaService.event.findUnique({
      where: { [identifier]: input },
    });
  }

  async update(
    id: UUID,
    updateEventDto: UpdateEventDto
  ): Promise<DBEventModel> {
    return await this.prismaService.event.update({
      where: { id },
      data: {
        slug: updateEventDto.slug,
        title: updateEventDto.title,
        description: updateEventDto.description,
        status: updateEventDto.status,
        scheduledAt: updateEventDto.scheduledAt,
      },
    });
  }

  async delete(id: UUID): Promise<DBEventModel> {
    return await this.prismaService.event.delete({ where: { id } });
  }
}

export default EventsService;
