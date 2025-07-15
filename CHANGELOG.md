# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-07-15

### Added
- Initial release of the Apito JavaScript SDK
- Complete implementation matching the Go SDK functionality
- TypeScript support with full type definitions
- Core client with all GraphQL operations
- Typed operations for type-safe development
- Comprehensive error handling
- Environment variable support
- Basic and advanced examples
- Full documentation and README
- MIT License

### Features
- `getSingleResource()` - Get single resource by ID
- `searchResources()` - Search resources with filtering
- `createNewResource()` - Create new resources
- `updateResource()` - Update existing resources
- `deleteResource()` - Delete resources
- `getRelationDocuments()` - Get related documents
- `generateTenantToken()` - Generate tenant tokens
- `sendAuditLog()` - Send audit log entries
- `debug()` - Debug functionality

### Type Safety
- Generic typed methods for all operations
- TypeScript interfaces for all data structures
- Error type definitions
- Configuration type definitions

### Error Handling
- Custom error classes for different error types
- GraphQL error parsing
- HTTP error handling
- Validation error handling

### Documentation
- Comprehensive README with examples
- TypeScript documentation
- API reference
- Quick start guide
- Advanced usage examples
