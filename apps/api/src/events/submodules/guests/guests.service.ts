import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Event as DBEventModel,
  EventGuest as DBEventGuestModel,
} from '@prisma/client';

import { PrismaService, UUID } from '@/common';

import { CreateEventGuestDto, UpdateEventGuestDto } from './dto';

@Injectable()
export class EventsGuestsService {
  constructor(private prismaService: PrismaService) {}

  async create(
    event: UUID | DBEventModel,
    createEventGuestDto: CreateEventGuestDto
  ): Promise<DBEventGuestModel> {
    return await this.prismaService.eventGuest.create({
      data: {
        dni: createEventGuestDto.dni,
        name: createEventGuestDto.name,
        email: createEventGuestDto.email,
        phone: createEventGuestDto.phone,
        from: createEventGuestDto.from,
        position: createEventGuestDto.position,
        event: {
          connect: { id: typeof event === 'string' ? event : event.id },
        },
      },
    });
  }

  async count(event: UUID | DBEventModel): Promise<number> {
    return await this.prismaService.eventGuest.count({
      where: { event: { id: typeof event === 'string' ? event : event.id } },
    });
  }

  async findAll(event: UUID | DBEventModel): Promise<DBEventGuestModel[]> {
    return await this.prismaService.eventGuest.findMany({
      where: { event: { id: typeof event === 'string' ? event : event.id } },
    });
  }

  async findUnique(
    input: Prisma.EventGuestWhereUniqueInput
  ): Promise<DBEventGuestModel | null> {
    return await this.prismaService.eventGuest.findUnique({ where: input });
  }

  async update(
    id: UUID,
    updateEventGuestDto: UpdateEventGuestDto
  ): Promise<DBEventGuestModel> {
    return await this.prismaService.eventGuest.update({
      where: { id },
      data: {
        dni: updateEventGuestDto.dni,
        name: updateEventGuestDto.name,
        email: updateEventGuestDto.email,
        phone: updateEventGuestDto.phone,
        from: updateEventGuestDto.from,
        position: updateEventGuestDto.position,
      },
    });
  }

  async delete(id: UUID): Promise<DBEventGuestModel> {
    return await this.prismaService.eventGuest.delete({ where: { id } });
  }
}

export default EventsGuestsService;
