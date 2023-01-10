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
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  CountSuppliersParamsDto,
  FindManySuppliersParamsDto,
} from './types';

export interface CreateSupplierReturn {
  supplier: Supplier | null;
  error: ServiceError | null;
}

export interface CountSuppliersServiceReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManySuppliersServiceReturn {
  suppliers: Supplier[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneSupplierByUUIDReturn {
  supplier: Supplier | null;
  error: ServiceError | null;
}

export interface UpdateSupplierReturn {
  supplier: Supplier | null;
  error: ServiceError | null;
}

export interface DeleteSupplierReturn {
  supplier: Supplier | null;
  error: ServiceError | null;
}

export class SuppliersService {
  constructor(private config: Config) {}

  async create(data: CreateSupplierDto): Promise<CreateSupplierReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Supplier>,
        AxiosResponse<SingleEntityResponse<Supplier>, CreateSupplierDto>,
        CreateSupplierDto
      >(ApiEndpoints.SUPPLIERS, data);

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
    params?: CountSuppliersParamsDto
  ): Promise<CountSuppliersServiceReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.SUPPLIERS_COUNT,
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
    params?: FindManySuppliersParamsDto
  ): Promise<FindManySuppliersServiceReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Supplier>
      >(ApiEndpoints.SUPPLIERS, { params });

      return {
        suppliers: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        suppliers: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneSupplierByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Supplier | null>
      >(`${ApiEndpoints.SUPPLIERS}/${id}`);

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
    data: UpdateSupplierDto
  ): Promise<UpdateSupplierReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Supplier>,
        AxiosResponse<SingleEntityResponse<Supplier>, UpdateSupplierDto>,
        UpdateSupplierDto
      >(`${ApiEndpoints.SUPPLIERS}/${id}`, data);

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

  async delete(id: UUID): Promise<DeleteSupplierReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Supplier>
      >(`${ApiEndpoints.SUPPLIERS}/${id}`);

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

export default SuppliersService;
