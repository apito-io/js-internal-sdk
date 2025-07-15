/**
 * Apito JavaScript SDK
 * A comprehensive JavaScript SDK for communicating with Apito GraphQL API endpoints
 * 
 * @module apito-sdk
 */

// Export main client and types
export { ApitoClient, createClient } from './client';
export { TypedOperations } from './typed-operations';
export * from './types';

// Re-export commonly used types for convenience
export type {
  ClientConfig,
  DefaultDocumentStructure,
  SearchResult,
  TypedDocumentStructure,
  TypedSearchResult,
  CreateAndUpdateRequest,
  AuditData,
  GraphQLResponse,
  GraphQLError,
  ApitoError,
  ValidationError,
  InjectedDBOperationInterface,
} from './types';

// Default export for convenience
export { ApitoClient as default } from './client';
