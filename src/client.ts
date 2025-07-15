import axios, { AxiosInstance } from 'axios';
import {
  ClientConfig,
  DefaultDocumentStructure,
  SearchResult,
  TypedDocumentStructure,
  TypedSearchResult,
  CreateAndUpdateRequest,
  AuditData,
  GraphQLResponse,
  GraphQLError as SDKGraphQLError,
  ApitoError,
  ValidationError,
  InjectedDBOperationInterface,
} from './types';

/**
 * Apito SDK Client - JavaScript implementation matching the Go SDK
 */
export class ApitoClient implements InjectedDBOperationInterface {
  private httpClient: AxiosInstance;
  private baseURL: string;
  private apiKey: string;
  private tenantId?: string;

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
    this.tenantId = config.tenantId;

    // Create axios instance with default configuration
    this.httpClient = axios.create({
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Apito-Key': this.apiKey,
      },
      ...config.httpClient,
    });

    // Add tenant ID to headers if provided
    if (this.tenantId) {
      this.httpClient.defaults.headers['X-Apito-Tenant-ID'] = this.tenantId;
    }
  }

  /**
   * Execute a GraphQL query or mutation
   */
  private async executeGraphQL<T = any>(
    query: string,
    variables?: Record<string, any>,
    options?: { tenantId?: string }
  ): Promise<GraphQLResponse> {
    try {
      const payload = {
        query,
        variables: variables || {},
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Apito-Key': this.apiKey,
      };

      if (options?.tenantId || this.tenantId) {
        headers['X-Apito-Tenant-ID'] = options?.tenantId || this.tenantId!;
      }

      const response = await this.httpClient.post<GraphQLResponse>(
        this.baseURL,
        payload,
        { headers }
      );

      if (response.data.errors && response.data.errors.length > 0) {
        throw new SDKGraphQLError(
          'GraphQL query failed',
          response.data.errors,
          response.data
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApitoError(
          error.response?.data?.message || error.message,
          'HTTP_ERROR',
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  }

  /**
   * Generate a new tenant token for the specified tenant ID
   */
  async generateTenantToken(token: string, tenantId: string): Promise<string> {
    const query = `
      mutation GenerateTenantToken($token: String!, $tenantId: String!) {
        generateTenantToken(token: $token, tenant_id: $tenantId) {
          token
        }
      }
    `;

    const variables = { token, tenantId };
    const response = await this.executeGraphQL(query, variables, { tenantId });

    const data = response.data?.generateTenantToken;
    if (!data?.token) {
      throw new ValidationError('Invalid response format for tenant token');
    }

    return data.token;
  }

  /**
   * Get a single resource by model and ID
   */
  async getSingleResource(
    model: string,
    id: string,
    singlePageData: boolean = false
  ): Promise<DefaultDocumentStructure> {
    const query = `
      query GetSingleData($model: String, $_id: String!, $single_page_data: Boolean) {
        getSingleData(model: $model, _id: $_id, single_page_data: $single_page_data) {
          _key
          data
          meta {
            created_at
            updated_at
            status
            revision
            revision_at
          }
          id
          expire_at
          relation_doc_id
          type
        }
      }
    `;

    const variables = {
      model,
      _id: id,
      single_page_data: singlePageData,
    };

    const response = await this.executeGraphQL(query, variables);
    
    if (!response.data?.getSingleData) {
      throw new ValidationError('Resource not found');
    }

    return response.data.getSingleData;
  }

  /**
   * Search resources in a model
   */
  async searchResources(
    model: string,
    filter: Record<string, any> = {},
    aggregate: boolean = false
  ): Promise<SearchResult> {
    const query = `
      query GetModelData(
        $model: String!
        $page: Int
        $limit: Int
        $_key: JSON
        $where: JSON
        $search: String
      ) {
        getModelData(
          model: $model
          page: $page
          limit: $limit
          _key: $_key
          where: $where
          search: $search
        ) {
          results {
            id
            relation_doc_id
            data
            type
            expire_at
            meta {
              created_at
              updated_at
              status
              root_revision_id
            }
          }
          count
        }
      }
    `;

    const variables = {
      model,
      ...filter,
    };

    const response = await this.executeGraphQL(query, variables);
    
    if (!response.data?.getModelData) {
      throw new ValidationError('Invalid search response format');
    }

    return response.data.getModelData;
  }

  /**
   * Get related documents
   */
  async getRelationDocuments(
    id: string,
    connection: Record<string, any>
  ): Promise<SearchResult> {
    const query = `
      query GetRelationDocuments(
        $_id: String!
        $connection: JSON
      ) {
        getRelationDocuments(
          _id: $_id
          connection: $connection
        ) {
          results {
            id
            relation_doc_id
            data
            type
            expire_at
            meta {
              created_at
              updated_at
              status
              root_revision_id
            }
          }
          count
        }
      }
    `;

    const variables = {
      _id: id,
      connection,
    };

    const response = await this.executeGraphQL(query, variables);
    
    if (!response.data?.getRelationDocuments) {
      throw new ValidationError('Invalid relation documents response format');
    }

    return response.data.getRelationDocuments;
  }

  /**
   * Create a new resource
   */
  async createNewResource(request: CreateAndUpdateRequest): Promise<DefaultDocumentStructure> {
    const query = `
      mutation CreateNewResource(
        $model: String!
        $payload: JSON!
        $connect: JSON
        $single_page_data: Boolean
      ) {
        createModelData(
          model_name: $model
          payload: $payload
          connect: $connect
          single_page_data: $single_page_data
        ) {
          id
          data
          meta {
            created_at
            updated_at
            status
            revision
            revision_at
          }
          type
        }
      }
    `;

    const variables = {
      model: request.model,
      payload: request.payload,
      connect: request.connect || null,
      single_page_data: request.singlePageData || false,
    };

    const response = await this.executeGraphQL(query, variables);
    
    if (!response.data?.createModelData) {
      throw new ValidationError('Invalid create response format');
    }

    return response.data.createModelData;
  }

  /**
   * Update an existing resource
   */
  async updateResource(request: CreateAndUpdateRequest): Promise<DefaultDocumentStructure> {
    const query = `
      mutation UpdateResource(
        $model: String!
        $_id: String!
        $payload: JSON!
        $connect: JSON
        $disconnect: JSON
        $single_page_data: Boolean
        $force_update: Boolean
      ) {
        upsertModelData(
          model_name: $model
          _id: $_id
          payload: $payload
          connect: $connect
          disconnect: $disconnect
          single_page_data: $single_page_data
          force_update: $force_update
        ) {
          id
          data
          meta {
            created_at
            updated_at
            status
            revision
            revision_at
          }
          type
        }
      }
    `;

    if (!request.id) {
      throw new ValidationError('ID is required for update operations');
    }

    const variables = {
      model: request.model,
      _id: request.id,
      payload: request.payload,
      connect: request.connect || null,
      disconnect: request.disconnect || null,
      single_page_data: request.singlePageData || false,
      force_update: request.forceUpdate || false,
    };

    const response = await this.executeGraphQL(query, variables);
    
    if (!response.data?.upsertModelData) {
      throw new ValidationError('Invalid update response format');
    }

    return response.data.upsertModelData;
  }

  /**
   * Delete a resource by model and ID
   */
  async deleteResource(model: string, id: string): Promise<void> {
    const query = `
      mutation DeleteResource($model: String!, $_id: String!) {
        deleteModelData(model_name: $model, _id: $_id) {
          id
        }
      }
    `;

    const variables = {
      model,
      _id: id,
    };

    await this.executeGraphQL(query, variables);
  }

  /**
   * Send audit log entry
   */
  async sendAuditLog(auditData: AuditData): Promise<void> {
    const query = `
      mutation SendAuditLog($auditData: JSON!) {
        sendAuditLog(auditData: $auditData) {
          message
        }
      }
    `;

    const variables = {
      auditData,
    };

    await this.executeGraphQL(query, variables);
  }

  /**
   * Debug functionality
   */
  async debug(stage: string, ...data: any[]): Promise<any> {
    const query = `
      mutation Debug($stage: String!, $data: JSON) {
        debug(stage: $stage, data: $data) {
          message
          data
        }
      }
    `;

    const variables = {
      stage,
      data: data.length === 1 ? data[0] : data,
    };

    const response = await this.executeGraphQL(query, variables);
    
    return response.data?.debug;
  }
}

/**
 * Factory function to create a new Apito client
 */
export function createClient(config: ClientConfig): ApitoClient {
  return new ApitoClient(config);
}
