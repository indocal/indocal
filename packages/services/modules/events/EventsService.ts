import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../common';
import { Config, ApiEndpoints } from '../../config';

import {
  Event,
  CreateEventDto,
  UpdateEventDto,
  CountEventsParamsDto,
  FindManyEventsParamsDto,
} from './types';

import { EventsGuestsService } from './submodules';

export interface CreateEventReturn {
  event: Event | null;
  error: ServiceError | null;
}

export interface CountEventsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyEventsReturn {
  events: Event[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneEventByUUIDReturn {
  event: Event | null;
  error: ServiceError | null;
}

export interface UpdateEventReturn {
  event: Event | null;
  error: ServiceError | null;
}

export interface DeleteEventReturn {
  event: Event | null;
  error: ServiceError | null;
}

export class EventsService {
  guests: EventsGuestsService;

  constructor(private config: Config) {
    this.guests = new EventsGuestsService(config);
  }

  async create(data: CreateEventDto): Promise<CreateEventReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Event>,
        AxiosResponse<SingleEntityResponse<Event>, CreateEventDto>,
        CreateEventDto
      >(ApiEndpoints.EVENTS, data);

      return {
        event: response.data,
        error: null,
      };
    } catch (error) {
      return {
        event: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountEventsParamsDto): Promise<CountEventsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.EVENTS_COUNT,
        { params }
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

  async findMany(
    params?: FindManyEventsParamsDto
  ): Promise<FindManyEventsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Event>
      >(ApiEndpoints.EVENTS, { params });

      return {
        events: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        events: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneEventByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Event | null>
      >(`${ApiEndpoints.EVENTS}/${id}`);

      return {
        event: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        event: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateEventDto): Promise<UpdateEventReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Event>,
        AxiosResponse<SingleEntityResponse<Event>, UpdateEventDto>,
        UpdateEventDto
      >(`${ApiEndpoints.EVENTS}/${id}`, data);

      return {
        event: response.data,
        error: null,
      };
    } catch (error) {
      return {
        event: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteEventReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Event>
      >(`${ApiEndpoints.EVENTS}/${id}`);

      return {
        event: response.data,
        error: null,
      };
    } catch (error) {
      return {
        event: null,
        error: createServiceError(error),
      };
    }
  }
}

export default EventsService;
