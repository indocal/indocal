import {
  ServiceError,
  createServiceError,
  UUID,
  SingleEntityResponse,
  MultipleEntitiesResponse,
} from '../../../../common';
import { Config, ApiEndpoints } from '../../../../config';

import { Order } from '../orders-service';

import { OrderItem } from './types';

export interface CountOrderItemsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindAllOrderItemsReturn {
  items: OrderItem[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneOrderItemByUUIDReturn {
  item: OrderItem | null;
  error: ServiceError | null;
}

export class OrdersItemsService {
  constructor(private config: Config) {}

  private getUUID(order: UUID | Order): UUID {
    return typeof order === 'string' ? order : order.id;
  }

  async count(order: UUID | Order): Promise<CountOrderItemsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        `${ApiEndpoints.ORDERS}/${this.getUUID(order)}/items/count`
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

  async findAll(order: UUID | Order): Promise<FindAllOrderItemsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<OrderItem>
      >(`${ApiEndpoints.ORDERS}/${this.getUUID(order)}/items`);

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

  async findOneByUUID(id: UUID): Promise<FindOneOrderItemByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<OrderItem | null>
      >(`${ApiEndpoints.ORDERS}/items/${id}`);

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

export default OrdersItemsService;
