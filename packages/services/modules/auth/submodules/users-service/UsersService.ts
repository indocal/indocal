import { AxiosResponse } from 'axios';

import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import {
  User,
  CreateUserDto,
  UpdateUserDto,
  CountUsersParamsDto,
  FindManyUsersParamsDto,
} from './types';

export interface CreateUserReturn {
  user: User | null;
  error: ServiceError | null;
}

export interface CountUsersReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyUsersReturn {
  users: User[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneUserByUUIDReturn {
  user: User | null;
  error: ServiceError | null;
}

export interface UpdateUserReturn {
  user: User | null;
  error: ServiceError | null;
}

export interface DeleteUserReturn {
  user: User | null;
  error: ServiceError | null;
}

export class UsersService {
  constructor(private config: Config) {}

  async create(data: CreateUserDto): Promise<CreateUserReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<User>,
        AxiosResponse<SingleEntityResponse<User>, CreateUserDto>,
        CreateUserDto
      >(ApiEndpoints.USERS, data);

      return {
        user: response.data,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountUsersParamsDto): Promise<CountUsersReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.USERS_COUNT,
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
    params?: FindManyUsersParamsDto
  ): Promise<FindManyUsersReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<User>
      >(ApiEndpoints.USERS, {
        params,
      });

      return {
        users: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        users: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneUserByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<User | null>
      >(`${ApiEndpoints.USERS}/${id}`);

      return {
        user: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateUserDto): Promise<UpdateUserReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<User>,
        AxiosResponse<SingleEntityResponse<User>, UpdateUserDto>,
        UpdateUserDto
      >(`${ApiEndpoints.USERS}/${id}`, data);

      return {
        user: response.data,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteUserReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<User>
      >(`${ApiEndpoints.USERS}/${id}`);

      return {
        user: response.data,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: createServiceError(error),
      };
    }
  }
}

export default UsersService;
