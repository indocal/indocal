import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { SupplyRequest } from '../supplies-requests-service';

import { SupplyRequestItem } from './types';

export interface CountSupplyRequestItemsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllSupplyRequestItemsReturn {
  items: SupplyRequestItem[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneSupplyRequestItemByUUIDReturn {
  item: SupplyRequestItem | null;
  error: ServiceError | null;
}

export class SuppliesRequestsItemsService {
  constructor(private config: Config) {}

  private getUUID(request: UUID | SupplyRequest): UUID {
    return typeof request === 'string' ? request : request.id;
  }

  async count(
    request: UUID | SupplyRequest
  ): Promise<CountSupplyRequestItemsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.SUPPLIES_REQUESTS}/${this.getUUID(request)}/items/count`
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
    request: UUID | SupplyRequest
  ): Promise<FindAllSupplyRequestItemsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<SupplyRequestItem>
      >(`${ApiEndpoints.SUPPLIES_REQUESTS}/${this.getUUID(request)}/items`);

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

  async findOneByUUID(id: UUID): Promise<FindOneSupplyRequestItemByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<SupplyRequestItem | null>
      >(`${ApiEndpoints.SUPPLIES_REQUESTS}/items/${id}`);

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

export default SuppliesRequestsItemsService;
