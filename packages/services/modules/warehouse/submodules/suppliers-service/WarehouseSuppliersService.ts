import { AxiosResponse } from 'axios';

import { ServiceError, createServiceError, UUID } from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import {
  WarehouseSupplier,
  CreateWarehouseSupplierDto,
  UpdateWarehouseSupplierDto,
  CountWarehouseSuppliersParamsDto,
  FindManyWarehouseSuppliersParamsDto,
} from './types';

export interface CreateWarehouseSupplierReturn {
  supplier: WarehouseSupplier | null;
  error: ServiceError | null;
}

export interface CountWarehouseSuppliersServiceReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyWarehouseSuppliersServiceReturn {
  suppliers: WarehouseSupplier[];
  error: ServiceError | null;
}

export interface FindOneWarehouseSupplierByUUIDReturn {
  supplier: WarehouseSupplier | null;
  error: ServiceError | null;
}

export interface UpdateWarehouseSupplierReturn {
  supplier: WarehouseSupplier | null;
  error: ServiceError | null;
}

export interface DeleteWarehouseSupplierReturn {
  supplier: WarehouseSupplier | null;
  error: ServiceError | null;
}

export class WarehouseSuppliersService {
  constructor(private config: Config) {}

  async create(
    data: CreateWarehouseSupplierDto
  ): Promise<CreateWarehouseSupplierReturn> {
    try {
      const response = await this.config.axios.post<
        WarehouseSupplier,
        AxiosResponse<WarehouseSupplier, CreateWarehouseSupplierDto>,
        CreateWarehouseSupplierDto
      >(ApiEndpoints.WAREHOUSE_SUPPLIERS, data);

      return {
        supplier: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supplier: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountWarehouseSuppliersParamsDto
  ): Promise<CountWarehouseSuppliersServiceReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.WAREHOUSE_SUPPLIERS_COUNT,
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
    params?: FindManyWarehouseSuppliersParamsDto
  ): Promise<FindManyWarehouseSuppliersServiceReturn> {
    try {
      const response = await this.config.axios.get<WarehouseSupplier[]>(
        ApiEndpoints.WAREHOUSE_SUPPLIERS,
        { params }
      );

      return {
        suppliers: response.data,
        error: null,
      };
    } catch (error) {
      return {
        suppliers: [],
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneWarehouseSupplierByUUIDReturn> {
    try {
      const response = await this.config.axios.get<WarehouseSupplier | null>(
        `${ApiEndpoints.WAREHOUSE_SUPPLIERS}/${id}`
      );

      return {
        supplier: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        supplier: null,
        error: createServiceError(error),
      };
    }
  }

  async update(
    id: UUID,
    data: UpdateWarehouseSupplierDto
  ): Promise<UpdateWarehouseSupplierReturn> {
    try {
      const response = await this.config.axios.patch<
        WarehouseSupplier,
        AxiosResponse<WarehouseSupplier, UpdateWarehouseSupplierDto>,
        UpdateWarehouseSupplierDto
      >(`${ApiEndpoints.WAREHOUSE_SUPPLIERS}/${id}`, data);

      return {
        supplier: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supplier: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteWarehouseSupplierReturn> {
    try {
      const response = await this.config.axios.delete<WarehouseSupplier>(
        `${ApiEndpoints.WAREHOUSE_SUPPLIERS}/${id}`
      );

      return {
        supplier: response.data,
        error: null,
      };
    } catch (error) {
      return {
        supplier: null,
        error: createServiceError(error),
      };
    }
  }
}

export default WarehouseSuppliersService;
