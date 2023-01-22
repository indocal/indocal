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
  InventoryMovement,
  CreateInventoryMovementDto,
  CountInventoryMovementsParamsDto,
  FindManyInventoryMovementsParamsDto,
} from './types';

import { InventoryMovementsItemsService } from '../inventory-movements-items-service';

export interface CreateInventoryMovementReturn {
  movement: InventoryMovement | null;
  error: ServiceError | null;
}

export interface CountInventoryMovementsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyInventoryMovementsReturn {
  movements: InventoryMovement[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneInventoryMovementByUUIDReturn {
  movement: InventoryMovement | null;
  error: ServiceError | null;
}

export class InventoryMovementsService {
  items: InventoryMovementsItemsService;

  constructor(private config: Config) {
    this.items = new InventoryMovementsItemsService(config);
  }

  async create(
    data: CreateInventoryMovementDto
  ): Promise<CreateInventoryMovementReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<InventoryMovement>,
        AxiosResponse<
          SingleEntityResponse<InventoryMovement>,
          CreateInventoryMovementDto
        >,
        CreateInventoryMovementDto
      >(ApiEndpoints.INVENTORY_MOVEMENTS, data);

      return {
        movement: response.data,
        error: null,
      };
    } catch (error) {
      return {
        movement: null,
        error: createServiceError(error),
      };
    }
  }

  async count(
    params?: CountInventoryMovementsParamsDto
  ): Promise<CountInventoryMovementsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.INVENTORY_MOVEMENTS_COUNT,
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
    params?: FindManyInventoryMovementsParamsDto
  ): Promise<FindManyInventoryMovementsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<InventoryMovement>
      >(ApiEndpoints.INVENTORY_MOVEMENTS, { params });

      return {
        movements: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        movements: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneInventoryMovementByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<InventoryMovement | null>
      >(`${ApiEndpoints.INVENTORY_MOVEMENTS}/${id}`);

      return {
        movement: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        movement: null,
        error: createServiceError(error),
      };
    }
  }
}

export default InventoryMovementsService;
