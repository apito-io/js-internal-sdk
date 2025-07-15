import { ApitoClient } from '../client';
import { TypedOperations } from '../typed-operations';
import { ApitoError } from '../types';

// Mock axios
jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApitoClient', () => {
  let client: ApitoClient;

  beforeEach(() => {
    client = new ApitoClient({
      baseURL: 'https://api.apito.io/graphql',
      apiKey: 'test-api-key',
    });
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with required config', () => {
      expect(client).toBeInstanceOf(ApitoClient);
    });

    it('should set default timeout', () => {
      const clientWithDefaults = new ApitoClient({
        baseURL: 'https://api.apito.io/graphql',
        apiKey: 'test-key',
      });
      expect(clientWithDefaults).toBeDefined();
    });
  });

  describe('getSingleResource', () => {
    it('should fetch single resource successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            getSingleData: {
              id: '123',
              data: { title: 'Test Todo', status: 'todo' },
              meta: { created_at: '2024-01-01T00:00:00Z' },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.getSingleResource('todos', '123');
      
      expect(result.id).toBe('123');
      expect(result.data.title).toBe('Test Todo');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.apito.io/graphql',
        expect.objectContaining({
          query: expect.stringContaining('getSingleData'),
          variables: { model: 'todos', _id: '123', single_page_data: false },
        }),
        expect.any(Object)
      );
    });

    it('should handle errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      await expect(client.getSingleResource('todos', '123')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('searchResources', () => {
    it('should search resources with filters', async () => {
      const mockResponse = {
        data: {
          data: {
            getModelData: {
              results: [
                { id: '1', data: { title: 'Todo 1' } },
                { id: '2', data: { title: 'Todo 2' } },
              ],
              count: 2,
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.searchResources('todos', {
        where: { status: 'todo' },
        limit: 10,
      });

      expect(result.count).toBe(2);
      expect(result.results).toHaveLength(2);
    });
  });

  describe('createNewResource', () => {
    it('should create new resource successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            upsertModelData: {
              id: 'new-id',
              data: { title: 'New Todo' },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.createNewResource({
        model: 'todos',
        payload: { title: 'New Todo' },
      });

      expect(result.id).toBe('new-id');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          query: expect.stringContaining('upsertModelData'),
        }),
        expect.any(Object)
      );
    });
  });

  describe('updateResource', () => {
    it('should update existing resource', async () => {
      const mockResponse = {
        data: {
          data: {
            upsertModelData: {
              id: '123',
              data: { title: 'Updated Todo', status: 'completed' },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.updateResource({
        model: 'todos',
        id: '123',
        payload: { status: 'completed' },
      });

      expect(result.id).toBe('123');
      expect(result.data.status).toBe('completed');
    });
  });

  describe('deleteResource', () => {
    it('should delete resource successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            deleteModelData: { id: '123' },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      await expect(
        client.deleteResource('todos', '123')
      ).resolves.not.toThrow();
    });
  });

  describe('getRelationDocuments', () => {
    it('should fetch related documents', async () => {
      const mockResponse = {
        data: {
          data: {
            getModelData: {
              results: [
                { id: 'user-1', data: { name: 'John' } },
                { id: 'user-2', data: { name: 'Jane' } },
              ],
              count: 2,
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.getRelationDocuments('todo-123', {
        model: 'users',
        field: 'assigned_to',
      });

      expect(result.count).toBe(2);
      expect(result.results).toHaveLength(2);
    });
  });
});

describe('TypedOperations', () => {
  let client: ApitoClient;
  let typed: TypedOperations;

  beforeEach(() => {
    client = new ApitoClient({
      baseURL: 'https://api.apito.io/graphql',
      apiKey: 'test-key',
    });
    typed = new TypedOperations(client);
    jest.clearAllMocks();
  });

  describe('createNewResourceTyped', () => {
    it('should create resource with type safety', async () => {
      interface Todo {
        id: string;
        title: string;
        status: string;
      }

      const mockResponse = {
        data: {
          data: {
            upsertModelData: {
              id: 'typed-id',
              data: { title: 'Typed Todo', status: 'todo' },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await typed.createNewResourceTyped<Todo>({
        model: 'todos',
        payload: { title: 'Typed Todo', status: 'todo' },
      });

      expect(result.data.title).toBe('Typed Todo');
      expect(result.data.status).toBe('todo');
    });
  });

  describe('searchResourcesTyped', () => {
    it('should search with typed results', async () => {
      interface User {
        id: string;
        name: string;
        email: string;
      }

      const mockResponse = {
        data: {
          data: {
            getModelData: {
              results: [
                { id: '1', data: { name: 'John', email: 'john@example.com' } },
                { id: '2', data: { name: 'Jane', email: 'jane@example.com' } },
              ],
              count: 2,
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await typed.searchResourcesTyped<User>('users', {
        where: { active: true },
      });

      expect(result.count).toBe(2);
      expect(result.results[0].data.name).toBe('John');
      expect(result.results[0].data.email).toBe('john@example.com');
    });
  });
});

describe('ApitoError', () => {
  it('should create error with message', () => {
    const error = new ApitoError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('ApitoError');
  });

  it('should create error with code', () => {
    const error = new ApitoError('Test error', 'VALIDATION_ERROR');
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('should create error with GraphQL errors', () => {
    const graphQLErrors = [{ message: 'Validation failed' }];
    const error = new ApitoError('GraphQL error', undefined, graphQLErrors);
    expect(error.graphQLErrors).toEqual(graphQLErrors);
  });
});
