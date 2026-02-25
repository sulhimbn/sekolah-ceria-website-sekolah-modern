# Sekolah Ceria - Architecture Blueprint

## Current Architecture

### Frontend Structure
```
src/
├── components/        # React components (UI + Layout)
│   ├── layout/      # Layout components (Header, Footer, MainLayout)
│   └── ui/          # ShadCN UI components
├── pages/          # Page components (refactored to use hooks/services)
├── hooks/          # Custom hooks
│   ├── api/        # API-related hooks (useNews, useNewsArticle, useContactForm)
│   │   ├── use-news.ts
│   │   ├── use-news-article.ts
│   │   ├── use-contact-form.ts
│   │   ├── use-users.ts
│   │   ├── use-chats.ts
│   │   ├── use-chat-messages.ts
│   │   └── index.ts
│   └── ui/         # UI-related hooks (useTheme, useMobile)
├── services/       # Business logic services
│   ├── news.service.ts      # News operations: list, get, search, filter
│   ├── contact.service.ts   # Contact operations: submit, validate
│   ├── user.service.ts      # User operations: list, create
│   ├── chat.service.ts     # Chat operations: list, messages
│   └── index.ts
├── repositories/   # Data access layer
│   ├── interfaces/         # Repository contracts
│   │   ├── news.repository.interface.ts
│   │   ├── contact.repository.interface.ts
│   │   ├── user.repository.interface.ts
│   │   ├── chat.repository.interface.ts
│   │   └── index.ts
│   └── implementations/    # Repository implementations
│       ├── news.repository.ts
│       ├── contact.repository.ts
│       ├── user.repository.ts
│       ├── chat.repository.ts
│       └── index.ts
└── lib/            # Utilities
    ├── api-client.ts       # API client
    ├── error-reporter.ts   # Error reporting
    ├── messages.ts         # Centralized error messages
    ├── validation-config.ts # Validation constants
    └── utils.ts
```

### Backend Structure
```
worker/
├── index.ts        # Worker entry point (Hono app setup)
├── user-routes.ts  # API route definitions
├── core-utils.ts   # Durable Object utilities (Entity, Index base classes)
└── entities.ts     # Entity implementations (User, Chat, News)
```

### Shared Types
```
shared/
├── types.ts        # TypeScript types (API contracts)
└── mock-data.ts    # Demo data for entities
```

**Architecture Status**: All Phase 1-5 implemented (100%).

## Remaining Issues (Post-Refactoring)

### 1. **API Hook Interface Standardization** (Medium Priority)
- Issue #12 tracks this effort
- Different hooks return differently named items (articles vs users vs chats)
- Need consistent return interface across all hooks

### 2. ~~Type Safety - Runtime Validation~~ ✅ (Complete - Issue #64)
   - Zod schemas defined in src/lib/zod-schemas.ts
   - Runtime validation integrated in all repositories
   - Tests added in src/lib/api-validator.test.ts
- Issue #9 tracks this effort
- Zod is installed but not yet used for runtime validation
- Need Zod schemas for API response validation

### 3. **Testing** (Low Priority)
- Issue #10, #11 track testing infrastructure
- Services and hooks have test files but coverage needs expansion
- Mocking strategies defined but not fully implemented

## Target Architecture

### Layered Architecture (Clean Architecture Principles)

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  (Pages, Components) - Only handles UI, user interactions     │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                     Application Layer                        │
│  (Services, Custom Hooks) - Business logic, orchestration   │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      Data Layer                             │
│  (API Client, Repositories) - Data access, transformation    │
└─────────────────────────────────────────────────────────────┘
```

### Proposed Frontend Structure
```
src/
├── components/        # Pure presentation components
│   ├── layout/      # Layout components
│   └── ui/          # ShadCN UI components
├── pages/          # Container components (minimal logic)
├── hooks/          # Custom hooks (data fetching, business logic)
│   ├── api/        # API-related hooks (useNews, useContact)
│   └── ui/         # UI-related hooks (useTheme, useMobile)
├── services/       # Business logic services
│   ├── news.service.ts
│   ├── contact.service.ts
│   └── ...
├── lib/            # Utilities
│   ├── api-client.ts (enhanced)
│   ├── error-reporter.ts
│   └── utils.ts
└── types/          # Frontend-specific types
    └── index.ts
```

### Proposed Backend Structure (Keep as-is)
```
worker/
├── index.ts        # Worker entry point
├── routes/         # Route definitions (organize by feature)
│   ├── index.ts
│   ├── news.routes.ts
│   ├── contact.routes.ts
│   └── ...
├── core-utils.ts   # Durable Object utilities
├── entities/       # Entity implementations
│   ├── index.ts
│   ├── user.entity.ts
│   ├── news.entity.ts
│   └── ...
└── validators/     # Request validation schemas (zod)
    └── index.ts
```

## Key Patterns to Implement

### 1. Repository Pattern
- Abstract data access behind interfaces
- Centralize API call logic
- Enable easy mocking for tests

### 2. Service Layer
- Encapsulate business rules
- Coordinate between multiple repositories
- Handle data transformations

### 3. Custom Hooks for Data Fetching
- Reuse loading/error/success patterns
- Encapsulate API calls with proper error handling
- Provide typed responses

### 4. Dependency Inversion
- Depend on abstractions (interfaces) not implementations
- Use factory functions for creating services
- Make components testable

### 5. Single Responsibility
- Each component/service has one clear purpose
- Pages orchestrate, services handle logic, repositories handle data

## Implementation Progress

1. **Phase 1: Service Layer** ✅ (Complete - 100%)
   - NewsService: article listing, search, filtering, recent articles
   - ContactService: form validation, submission
   - UserService: user listing, creation
   - ChatService: chat management, message handling

2. **Phase 2: Custom Hooks** ✅ (Complete - 100%)
   - useNews: data fetching with loading/error states
   - useNewsArticle: single article fetching
   - useContactForm: form submission
   - useUsers: user CRUD operations
   - useChats: chat listing
   - useChatMessages: message fetching
   - All hooks use consistent error handling via errorReporter

3. **Phase 3: Repository Pattern** ✅ (Complete - 100%)
   - INewsRepository, IContactRepository, IUserRepository, IChatRepository
   - All services now depend on repository interfaces
   - Dependency injection via factory functions
   - Easy mocking for tests enabled

4. **Phase 4: Error Handling** ✅ (Complete - 100%)
   - MESSAGES constant in lib/messages.ts (centralized)
   - VALIDATION_CONFIG constant in lib/validation-config.ts
   - Services use centralized error messages

5. **Phase 5: Type Safety** ✅ (Complete - 100% - Issue #64)
   - Zod runtime validation implemented
   - Schemas defined in src/lib/zod-schemas.ts
   - Validation layer in src/lib/api-validator.ts
   - Integrated in all repositories (User, Contact, Chat, News)
   - Tests added in src/lib/api-validator.test.ts
   - Zod installed but not yet used
   - Future: Add runtime type validation for API responses

## Data Flow

```
User Action → Component → Custom Hook → Service → Repository → API → Backend
     ↓             ↓              ↓          ↓           ↓          ↓
  UI Update   State Mgmt   Business Logic  Data Access  Network  Entity
```

## Testing Strategy

- **Unit Tests**: Services, repositories, utilities
- **Component Tests**: Pages, components with mocked services
- **Integration Tests**: API endpoints with test entities

## Success Criteria

- [x] Clear separation between presentation, business logic, and data layers
- [x] Reusable data fetching patterns across pages
- [x] Consistent error handling
- [x] Type-safe API contracts
- [x] Easy to test (mockable services)
- [x] Scalable for new features
