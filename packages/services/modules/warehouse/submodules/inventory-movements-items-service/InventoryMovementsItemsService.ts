import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { InventoryMovement } from '../inventory-movements-service';

import { InventoryMovementItem } from './types';

export interface CountInventoryMovementItemsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllInventoryMovementItemsReturn {
  items: InventoryMovementItem[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneInventoryMovementItemByUUIDReturn {
  item: InventoryMovementItem | null;
  error: ServiceError | null;
}

export class InventoryMovementsItemsService {
  constructor(private config: Config) {}

  private getUUID(movement: UUID | InventoryMovement): UUID {
    return typeof movement === 'string' ? movement : movement.id;
  }

  async count(
    movement: UUID | InventoryMovement
  ): Promise<CountInventoryMovementItemsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.INVENTORY_MOVEMENTS}/${this.getUUID(
          movement
        )}/items/count`
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

  async findAll(
    movement: UUID | InventoryMovement
  ): Promise<FindAllInventoryMovementItemsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<InventoryMovementItem>
      >(`${ApiEndpoints.INVENTORY_MOVEMENTS}/${this.getUUID(movement)}/items`);

      return {
        items: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        items: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(
    id: UUID
  ): Promise<FindOneInventoryMovementItemByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<InventoryMovementItem | null>
      >(`${ApiEndpoints.INVENTORY_MOVEMENTS}/items/${id}`);

      return {
        item: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        item: null,
        error: createServiceError(error),
      };
    }
  }
}

export default InventoryMovementsItemsService;
