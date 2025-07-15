import {
  TypedDocumentStructure,
  TypedSearchResult,
  CreateAndUpdateRequest,
} from './types';
import { ApitoClient } from './client';

/**
 * Typed operations wrapper for the Apito SDK
 * Provides type-safe methods for working with typed data
 */
export class TypedOperations {
  constructor(private client: ApitoClient) {}

  /**
   * Get a single resource with type safety
   */
  async getSingleResourceTyped<T>(
    model: string,
    id: string,
    singlePageData: boolean = false
  ): Promise<TypedDocumentStructure<T>> {
    const result = await this.client.getSingleResource(model, id, singlePageData);
    return result as TypedDocumentStructure<T>;
  }

  /**
   * Search resources with type safety
   */
  async searchResourcesTyped<T>(
    model: string,
    filter: Record<string, any> = {},
    aggregate: boolean = false
  ): Promise<TypedSearchResult<T>> {
    const result = await this.client.searchResources(model, filter, aggregate);
    return {
      results: result.results as TypedDocumentStructure<T>[],
      count: result.count,
    };
  }

  /**
   * Get related documents with type safety
   */
  async getRelationDocumentsTyped<T>(
    id: string,
    connection: Record<string, any>
  ): Promise<TypedSearchResult<T>> {
    const result = await this.client.getRelationDocuments(id, connection);
    return {
      results: result.results as TypedDocumentStructure<T>[],
      count: result.count,
    };
  }

  /**
   * Create a new resource with type safety
   */
  async createNewResourceTyped<T>(
    request: CreateAndUpdateRequest
  ): Promise<TypedDocumentStructure<T>> {
    const result = await this.client.createNewResource(request);
    return result as TypedDocumentStructure<T>;
  }

  /**
   * Update a resource with type safety
   */
  async updateResourceTyped<T>(
    request: CreateAndUpdateRequest
  ): Promise<TypedDocumentStructure<T>> {
    const result = await this.client.updateResource(request);
    return result as TypedDocumentStructure<T>;
  }
}
