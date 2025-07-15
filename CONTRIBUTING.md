# Contributing to @apito/js-internal-sdk

Thank you for your interest in contributing to the Apito JavaScript SDK! This document provides guidelines for contributing to this project.

## 🚀 Development Setup

### Prerequisites

- Node.js 16 or higher
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://gitlab.com/apito.io/js-internal-sdk.git
cd js-internal-sdk

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Development Scripts

- `npm start` - Start development mode with file watching
- `npm run build` - Build the project for production
- `npm test` - Run all tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run size` - Check bundle size

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

- Tests should be placed in `src/__tests__/` directory
- Use descriptive test names
- Mock external dependencies
- Test both success and error cases

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something', async () => {
    // Test implementation
  });
});
```

## 📦 Building

### Build Process

The project uses `tsup` for building:

```bash
# Build for production
npm run build

# Build with watch mode
npm run start
```

### Output Structure

- `dist/index.js` - CommonJS build
- `dist/index.mjs` - ES Module build
- `dist/index.d.ts` - TypeScript declarations

## 📝 Code Style

### ESLint Configuration

We use ESLint with the following rules:
- `@typescript-eslint/recommended`
- `prettier`

### Prettier Configuration

```json
{
  "printWidth": 80,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2
}
```

### Code Guidelines

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use descriptive variable names
- Add JSDoc comments for public APIs
- Follow functional programming principles where possible

## 🔄 Commit Messages

We use conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: test additions/changes
chore: maintenance tasks
```

Examples:
- `feat: add support for custom headers`
- `fix: handle network errors gracefully`
- `docs: update README with new examples`

## 🚀 Release Process

### Versioning

We use semantic versioning (semver):
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Publish to npm

```bash
# Version bump
npm version patch|minor|major

# Publish
npm publish
```

## 🐛 Bug Reports

### Bug Report Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- SDK Version: [e.g., 1.0.0]
- Node.js Version: [e.g., 16.14.0]
- OS: [e.g., macOS 12.3]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Describe the use case for this feature.

**Proposed Solution**
Describe how you think this could be implemented.

**Alternatives**
Describe any alternative solutions you've considered.

**Additional Context**
Any other context about the feature request.
```

## 📋 Pull Request Process

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No breaking changes (or properly documented)

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added
- [ ] All tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🏗️ Architecture

### Project Structure

```
js-internal-sdk/
├── src/
│   ├── client.ts          # Main client implementation
│   ├── types.ts           # Type definitions
│   ├── typed-operations.ts # Type-safe operations
│   └── index.ts           # Main exports
├── examples/
│   └── basic/
│       └── index.js       # Usage examples
├── dist/                  # Built files
├── tests/                 # Test files
└── docs/                  # Documentation
```

### Key Components

1. **ApitoClient** - Main client class
2. **TypedOperations** - Type-safe operations
3. **Error Handling** - Comprehensive error classes
4. **GraphQL Integration** - GraphQL query builder

## 🆘 Getting Help

- **Issues**: [GitLab Issues](https://gitlab.com/apito.io/js-internal-sdk/issues)
- **Documentation**: [docs.apito.io](https://docs.apito.io)
- **Discord**: [Join our community](https://discord.gg/apito)
- **Email**: support@apito.io

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
