import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Event } from '../../types';

import { EventGuest, CreateEventGuestDto, UpdateEventGuestDto } from './types';

export interface CreateEventGuestReturn {
  guest: EventGuest | null;
  error: ServiceError | null;
}

export interface CountEventGuestsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllEventGuestsReturn {
  guests: EventGuest[];
  error: ServiceError | null;
}

export interface FindOneEventGuestByUUIDReturn {
  guest: EventGuest | null;
  error: ServiceError | null;
}

export interface UpdateEventGuestReturn {
  guest: EventGuest | null;
  error: ServiceError | null;
}

export interface DeleteEventGuestReturn {
  guest: EventGuest | null;
  error: ServiceError | null;
}

export class EventsGuestsService {
  constructor(private config: Config) {}

  private getUUID(event: UUID | Event): UUID {
    return typeof event === 'string' ? event : event.id;
  }

  async create(
    event: UUID | Event,
    data: CreateEventGuestDto
  ): Promise<CreateEventGuestReturn> {
    try {
      const response = await this.config.axios.post<
        EventGuest,
        AxiosResponse<EventGuest, CreateEventGuestDto>,
        CreateEventGuestDto
      >(`${ApiEndpoints.EVENTS}/${this.getUUID(event)}/guests`, data);

      return {
        guest: response.data,
        error: null,
      };
    } catch (error) {
      return {
        guest: null,
        error: createServiceError(error),
      };
    }
  }

  async count(event: UUID | Event): Promise<CountEventGuestsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.EVENTS}/${this.getUUID(event)}/guests/count`
      );

      return {
        count: response.data,
        error: null,
      };
    } catch (error) {
      return {
        count: null,
        error: createServiceError(error),
      };
    }
  }

  async findAll(event: UUID | Event): Promise<FindAllEventGuestsReturn> {
    try {
      const response = await this.config.axios.get<EventGuest[]>(
        `${ApiEndpoints.EVENTS}/${this.getUUID(event)}/guests`
      );

      return {
        guests: response.data,
        error: null,
      };
    } catch (error) {
      return {
        guests: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneEventGuestByUUIDReturn> {
    try {
      const response = await this.config.axios.get<EventGuest | null>(
        `${ApiEndpoints.EVENTS}/guests/${id}`
      );

      return {
        guest: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        guest: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateEventGuestDto
  ): Promise<UpdateEventGuestReturn> {
    try {
      const response = await this.config.axios.patch<
        EventGuest,
        AxiosResponse<EventGuest, UpdateEventGuestDto>,
        UpdateEventGuestDto
      >(`${ApiEndpoints.EVENTS}/guests/${id}`, data);

      return {
        guest: response.data,
        error: null,
      };
    } catch (error) {
      return {
        guest: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteEventGuestReturn> {
    try {
      const response = await this.config.axios.delete<EventGuest>(
        `${ApiEndpoints.EVENTS}/guests/${id}`
      );

      return {
        guest: response.data,
        error: null,
      };
    } catch (error) {
      return {
        guest: null,
        error: createServiceError(error),
      };
    }
  }
}

export default EventsGuestsService;
