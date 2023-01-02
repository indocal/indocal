import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import {
  Supply,
  CreateSupplyDto,
  UpdateSupplyDto,
  CountSuppliesParamsDto,
  FindManySuppliesParamsDto,
} from './types';

export interface CreateSupplyReturn {
  supply: Supply | null;
  error: ServiceError | null;
}

export interface CountSuppliesServiceReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManySuppliesServiceReturn {
  supplies: Supply[];
  error: ServiceError | null;
}

export interface FindOneSupplyByUUIDReturn {
  supply: Supply | null;
  error: ServiceError | null;
}

export interface UpdateSupplyReturn {
  supply: Supply | null;
  error: ServiceError | null;
}

export interface DeleteSupplyReturn {
  supply: Supply | null;
  error: ServiceError | null;
}

export class SuppliesService {
  constructor(private config: Config) {}

  async create(data: CreateSupplyDto): Promise<CreateSupplyReturn> {
    try {
      const response = await this.config.axios.post<
        Supply,
        AxiosResponse<Supply, CreateSupplyDto>,
        CreateSupplyDto
      >(ApiEndpoints.SUPPLIES, data);

      return {
        supply: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supply: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountSuppliesParamsDto
  ): Promise<CountSuppliesServiceReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SUPPLIES_COUNT,
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
    params?: FindManySuppliesParamsDto
  ): Promise<FindManySuppliesServiceReturn> {
    try {
      const response = await this.config.axios.get<Supply[]>(
        ApiEndpoints.SUPPLIES,
        { params }
      );

      return {
        supplies: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supplies: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneSupplyByUUIDReturn> {
    try {
      const response = await this.config.axios.get<Supply | null>(
        `${ApiEndpoints.SUPPLIES}/${id}`
      );

      return {
        supply: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        supply: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateSupplyDto): Promise<UpdateSupplyReturn> {
    try {
      const response = await this.config.axios.patch<
        Supply,
        AxiosResponse<Supply, UpdateSupplyDto>,
        UpdateSupplyDto
      >(`${ApiEndpoints.SUPPLIES}/${id}`, data);

      return {
        supply: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supply: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteSupplyReturn> {
    try {
      const response = await this.config.axios.delete<Supply>(
        `${ApiEndpoints.SUPPLIES}/${id}`
      );

      return {
        supply: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supply: null,
        error: createServiceError(error),
      };
    }
  }
}

export default SuppliesService;
