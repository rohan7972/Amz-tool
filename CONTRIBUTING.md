# Contributing to Amazon FDC Tool

Thank you for your interest in contributing to Amazon FDC Tool! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Git
- Docker (optional, for containerized development)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/Amazon-FDC-Tool.git
   cd Amazon-FDC-Tool
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Set Up Environment**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit the .env files with your configuration
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

#### TypeScript
- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Define proper interfaces and types
- Use meaningful variable and function names

#### React Components
- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types and interfaces
- Implement error boundaries where appropriate

#### Backend Code
- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Follow RESTful API conventions

### Project Structure

```
Amazon-FDC-Tool/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── store/         # State management (Zustand)
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
└── shared/               # Shared types and utilities
```

### Naming Conventions

#### Files and Directories
- Use kebab-case for file names: `user-profile.component.tsx`
- Use PascalCase for React components: `UserProfile.tsx`
- Use camelCase for utility functions: `formatCurrency.ts`

#### Variables and Functions
- Use camelCase for variables and functions: `getUserData`
- Use PascalCase for classes and interfaces: `UserService`, `ApiResponse`
- Use UPPER_SNAKE_CASE for constants: `MAX_RETRY_ATTEMPTS`

#### Database
- Use snake_case for table and column names: `user_accounts`, `created_at`
- Use descriptive names for indexes: `idx_users_email_active`

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Backend Testing
```bash
cd backend
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Testing Guidelines
- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for at least 80% code coverage
- Use descriptive test names and organize tests logically

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Examples
```
feat(dashboard): add performance trend chart

Add interactive chart component for displaying performance trends
with date range selection and metric toggles.

Closes #123
```

```
fix(api): resolve authentication token expiration issue

Fix issue where JWT tokens were not being properly refreshed,
causing users to be logged out unexpectedly.

Fixes #456
```

## 🔄 Pull Request Process

### Before Submitting
1. **Update Documentation**: Ensure README and other docs are updated
2. **Run Tests**: All tests must pass
3. **Check Linting**: Fix any linting errors
4. **Test Locally**: Verify changes work in development environment

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process
1. **Automated Checks**: CI/CD pipeline must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Reviewer should test changes locally
4. **Approval**: Changes approved by maintainer
5. **Merge**: Squash and merge to main branch

## 🐛 Bug Reports

### Before Reporting
1. **Search Existing Issues**: Check if bug already reported
2. **Reproduce**: Ensure bug is reproducible
3. **Environment**: Note your environment details

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96.0]
- Node.js: [e.g., 18.0.0]
- Version: [e.g., 1.0.0]

## Additional Context
Screenshots, logs, or other relevant information.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Mockups, examples, or other relevant information.
```

## 🏗️ Architecture Guidelines

### Frontend Architecture
- **State Management**: Use Zustand for global state
- **Data Fetching**: Use TanStack Query for server state
- **Routing**: Use React Router for navigation
- **Styling**: Use Mantine UI components and CSS modules
- **Forms**: Use React Hook Form with Zod validation

### Backend Architecture
- **API Design**: Follow RESTful conventions
- **Database**: Use PostgreSQL with Knex.js query builder
- **Authentication**: JWT with refresh tokens
- **Caching**: Use Redis for session and data caching
- **Background Jobs**: Use Bull Queue for async processing

### Database Guidelines
- **Migrations**: Use Knex.js migrations for schema changes
- **Indexing**: Add indexes for frequently queried columns
- **Relationships**: Use foreign keys and proper constraints
- **Performance**: Consider query optimization and caching

## 🔒 Security Guidelines

### General Security
- **Input Validation**: Validate all user inputs
- **Authentication**: Use secure authentication methods
- **Authorization**: Implement proper access controls
- **Data Protection**: Encrypt sensitive data
- **API Security**: Use rate limiting and CORS protection

### Sensitive Data
- **Environment Variables**: Never commit secrets to version control
- **API Keys**: Store securely and rotate regularly
- **User Data**: Follow data protection regulations
- **Logging**: Don't log sensitive information

## 📚 Documentation

### Code Documentation
- **Comments**: Write clear, concise comments
- **JSDoc**: Use JSDoc for function documentation
- **README**: Keep README files up to date
- **API Docs**: Document all API endpoints

### Documentation Standards
- **Clarity**: Write for your future self and others
- **Examples**: Provide code examples where helpful
- **Updates**: Keep documentation in sync with code changes
- **Structure**: Organize documentation logically

## 🤝 Community Guidelines

### Code of Conduct
- **Respectful**: Be respectful and inclusive
- **Constructive**: Provide constructive feedback
- **Collaborative**: Work together towards common goals
- **Professional**: Maintain professional communication

### Getting Help
- **Documentation**: Check existing documentation first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Engage with the community respectfully

## 📋 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
1. **Update Version**: Bump version in package.json files
2. **Update Changelog**: Document all changes
3. **Test**: Run full test suite
4. **Build**: Create production build
5. **Tag**: Create git tag for release
6. **Deploy**: Deploy to production environment

Thank you for contributing to Amazon FDC Tool! 🚀