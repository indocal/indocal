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
  Supply,
  CreateSupplyDto,
  UpdateSupplyDto,
  CountSuppliesParamsDto,
  FindManySuppliesParamsDto,
  SupplyPrice,
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
  count: number;
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

export interface SupplyPricesReturn {
  prices: SupplyPrice[];
  error: ServiceError | null;
}

export class SuppliesService {
  constructor(private config: Config) {}

  private getUUID(supply: UUID | Supply): UUID {
    return typeof supply === 'string' ? supply : supply.id;
  }

  async create(data: CreateSupplyDto): Promise<CreateSupplyReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Supply>,
        AxiosResponse<SingleEntityResponse<Supply>, CreateSupplyDto>,
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
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Supply>
      >(ApiEndpoints.SUPPLIES, { params });

      return {
        supplies: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        supplies: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneSupplyByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Supply | null>
      >(`${ApiEndpoints.SUPPLIES}/${id}`);

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
        SingleEntityResponse<Supply>,
        AxiosResponse<SingleEntityResponse<Supply>, UpdateSupplyDto>,
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
      const response = await this.config.axios.delete<
        SingleEntityResponse<Supply>
      >(`${ApiEndpoints.SUPPLIES}/${id}`);

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

  // TODO: check?
  async prices(supply: UUID | Supply): Promise<SupplyPricesReturn> {
    try {
      const response = await this.config.axios.get<SupplyPrice[]>(
        `${ApiEndpoints.SUPPLIES}/${this.getUUID(supply)}/prices`
      );

      return {
        prices: response.data,
        error: null,
      };
    } catch (error) {
      return {
        prices: [],
        error: createServiceError(error),
      };
    }
  }
}

export default SuppliesService;
