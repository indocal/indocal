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
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  CountCommentsParamsDto,
  FindManyCommentsParamsDto,
} from './types';

export interface CreateCommentReturn {
  comment: Comment | null;
  error: ServiceError | null;
}

export interface CountCommentsReturn {
  count: number | null;
  error: ServiceError | null;
}

export interface FindManyCommentsReturn {
  comments: Comment[];
  count: number;
  error: ServiceError | null;
}

export interface FindOneCommentByUUIDReturn {
  comment: Comment | null;
  error: ServiceError | null;
}

export interface UpdateCommentReturn {
  comment: Comment | null;
  error: ServiceError | null;
}

export interface DeleteCommentReturn {
  comment: Comment | null;
  error: ServiceError | null;
}

export class CommentsComment {
  constructor(private config: Config) {}

  async create(data: CreateCommentDto): Promise<CreateCommentReturn> {
    try {
      const response = await this.config.axios.post<
        SingleEntityResponse<Comment>,
        AxiosResponse<SingleEntityResponse<Comment>, CreateCommentDto>,
        CreateCommentDto
      >(ApiEndpoints.COMMENTS, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async count(params?: CountCommentsParamsDto): Promise<CountCommentsReturn> {
    try {
      const response = await this.config.axios.get<number>(
        ApiEndpoints.COMMENTS_COUNT,
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
    params?: FindManyCommentsParamsDto
  ): Promise<FindManyCommentsReturn> {
    try {
      const response = await this.config.axios.get<
        MultipleEntitiesResponse<Comment>
      >(ApiEndpoints.COMMENTS, {
        params,
      });

      return {
        comments: response.data.entities,
        count: response.data.count,
        error: null,
      };
    } catch (error) {
      return {
        comments: [],
        count: 0,
        error: createServiceError(error),
      };
    }
  }

  async findOneByUUID(id: UUID): Promise<FindOneCommentByUUIDReturn> {
    try {
      const response = await this.config.axios.get<
        SingleEntityResponse<Comment | null>
      >(`${ApiEndpoints.COMMENTS}/${id}`);

      return {
        comment: response.data || null,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async update(id: UUID, data: UpdateCommentDto): Promise<UpdateCommentReturn> {
    try {
      const response = await this.config.axios.patch<
        SingleEntityResponse<Comment>,
        AxiosResponse<SingleEntityResponse<Comment>, UpdateCommentDto>,
        UpdateCommentDto
      >(`${ApiEndpoints.COMMENTS}/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }

  async delete(id: UUID): Promise<DeleteCommentReturn> {
    try {
      const response = await this.config.axios.delete<
        SingleEntityResponse<Comment>
      >(`${ApiEndpoints.COMMENTS}/${id}`);

      return {
        comment: response.data,
        error: null,
      };
    } catch (error) {
      return {
        comment: null,
        error: createServiceError(error),
      };
    }
  }
}

export default CommentsComment;
