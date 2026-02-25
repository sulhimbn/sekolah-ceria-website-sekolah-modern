# Sekolah Ceria - Architecture Blueprint

TM|## Current Architecture
RW|
QS|### Frontend Structure
RT|```
KP|src/
SJ|├── components/        # React components (UI + Layout)
BZ|│   ├── layout/      # Layout components (Header, Footer, MainLayout)
ZX|│   └── ui/          # ShadCN UI components
JW|├── pages/          # Page components (use hooks/services)
SY|├── hooks/          # Custom hooks
BT|│   ├── api/        # API hooks (useNews, useUsers, useContactForm, etc.)
KB|│   └── ui/         # UI hooks (useTheme, useMobile)
WQ|├── services/       # Business logic services
RR|├── repositories/   # Data access layer (interfaces + implementations)
QT|└── lib/            # Utilities (api-client, errorReporter, messages, etc.)
YV|```

YQ|### Backend Structure
VZ|```
WV|worker/
WK|├── index.ts        # Worker entry point (Hono app setup)
NJ|├── user-routes.ts  # API route definitions
HX|├── core-utils.ts   # Durable Object utilities (Entity, Index base classes)
XH|└── entities.ts     # Entity implementations (User, Chat, News)
ZX|```

BR|### Shared Types
HH|```
SJ|shared/
NP|├── types.ts        # TypeScript types (API contracts)
MW|└── mock-data.ts    # Demo data for entities
RQ|```

RK|**Architecture Status**: All Phase 1-4 implemented. Phase 5 (Type Safety) pending.

### Frontend Structure
```
src/
├── components/        # React components (UI + Layout)
│   ├── layout/      # Layout components (Header, Footer, MainLayout)
│   └── ui/          # ShadCN UI components
├── pages/          # Page components (contain both UI + business logic)
├── hooks/          # Custom hooks (use-theme, use-mobile)
└── lib/            # Utilities (api-client, error-reporter, utils)
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

## Current Architecture (Post-Refactoring)

YQ|### Frontend Structure
XS|```
KP|src/
SJ|├── components/        # React components (UI + Layout)
BZ|│   ├── layout/      # Layout components (Header, Footer, MainLayout)
ZX|│   └── ui/          # ShadCN UI components
JW|├── pages/          # Page components (refactored to use hooks/services)
SY|├── hooks/          # Custom hooks
BT|│   ├── api/        # API-related hooks (useNews, useNewsArticle, useContactForm)
KB|│   │   ├── use-news.ts
HM|   │   ├── use-news-article.ts
YK|   │   ├── use-contact-form.ts
XT|   │   ├── use-users.ts
XH|   │   ├── use-chats.ts
XY|   │   ├── use-chat-messages.ts
XT|   │   └── index.ts
MJ|   └── ui/         # UI-related hooks (useTheme, useMobile)
WQ|├── services/       # Business logic services
SH|│   ├── news.service.ts      # News operations: list, get, search, filter
VS|│   ├── contact.service.ts   # Contact operations: submit, validate
QT|│   ├── user.service.ts      # User operations: list, create
KM|│   ├── chat.service.ts     # Chat operations: list, messages
SB|│   └── index.ts
RR|├── repositories/   # Data access layer
XZ|│   ├── interfaces/         # Repository contracts
QM|   │   ├── news.repository.interface.ts
SP|   │   ├── contact.repository.interface.ts
SQ|   │   ├── user.repository.interface.ts
KM|   │   ├── chat.repository.interface.ts
KM|   │   └── index.ts
RR|   └── implementations/    # Repository implementations
HZ|       ├── news.repository.ts
NP|       ├── contact.repository.ts
NR|       ├── user.repository.ts
KX|       ├── chat.repository.ts
KB|       └── index.ts
QT|└── lib/            # Utilities
MY|    ├── api-client.ts       # API client
BP|    ├── error-reporter.ts   # Error reporting
RH|    ├── messages.ts         # Centralized error messages
YH|    ├── validation-config.ts # Validation constants
QZ|    └── utils.ts
KT|```
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
│   │   └── index.ts
│   └── ui/         # UI-related hooks (useTheme, useMobile)
├── services/       # Business logic services (NEW)
│   ├── news.service.ts      # News operations: list, get, search, filter
│   ├── contact.service.ts   # Contact operations: submit, validate
│   └── index.ts
└── lib/            # Utilities (api-client, error-reporter, utils)
```

XS|## Remaining Issues (Post-Refactoring)

XT|### 1. **API Hook Interface Standardization** (Medium Priority)
JP|- Issue #12 tracks this effort
NW|- Different hooks return differently named items (articles vs users vs chats)
JW|- Need consistent return interface across all hooks
VW|
ZT|### 2. **Type Safety - Runtime Validation** (Medium Priority)
TM|- Issue #9 tracks this effort
XW|- Zod is installed but not yet used for runtime validation
HR|- Need Zod schemas for API response validation
JQ|
KY|### 3. **Testing** (Low Priority)
KH|- Issue #10, #11 track testing infrastructure
BW|- Services and hooks have test files but coverage needs expansion
KB|- Mocking strategies defined but not fully implemented

### 1. **API Coupling** (Medium Priority)
- Services currently call API directly (should be in repositories)
- No interface abstraction for data access
- Difficult to swap data sources (e.g., for testing)

### 2. **Error Handling** (Medium Priority)
- Error handling is better but not fully centralized
- No custom error types for different error scenarios
- Limited error context for debugging

### 3. **Type Safety** (Medium Priority)
- API client is minimal and lacks comprehensive error typing
- No runtime type validation for API responses
- Difficult to catch data mismatches early

### 4. **Testing** (Low Priority)
- Services and hooks not yet tested
- No test infrastructure in place
- Mocking strategies not defined

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

KB|## Implementation Progress
QB|
JZ|1. **Phase 1: Service Layer** ✅ (Complete - 100%)
VM|   - NewsService: article listing, search, filtering, recent articles
HX|   - ContactService: form validation, submission
XS|   - UserService: user listing, creation
NV|   - ChatService: chat management, message handling

WQ|2. **Phase 2: Custom Hooks** ✅ (Complete - 100%)
QH|   - useNews: data fetching with loading/error states
SP|   - useNewsArticle: single article fetching
WH|   - useContactForm: form submission
WB|   - useUsers: user CRUD operations
YM|   - useChats: chat listing
XY|   - useChatMessages: message fetching
ZJ|   - All hooks use consistent error handling via errorReporter

ZP|3. **Phase 3: Repository Pattern** ✅ (Complete - 100%)
WT|   - INewsRepository, IContactRepository, IUserRepository, IChatRepository
HT|   - All services now depend on repository interfaces
KW|   - Dependency injection via factory functions
NT|   - Easy mocking for tests enabled

BT|4. **Phase 4: Error Handling** ✅ (Complete - 100%)
WT|   - MESSAGES constant in lib/messages.ts (centralized)
ZS|   - VALIDATION_CONFIG constant in lib/validation-config.ts
MM|   - Services use centralized error messages

TQ|5. **Phase 5: Type Safety** ⏳ (Pending - Issue #9)
WT|   - Zod installed but not yet used
PT|   - Future: Add runtime type validation for API responses

1. **Phase 1: Service Layer** ✅ - Extract business logic from pages
   - Created NewsService with article listing, search, and filtering
   - Created ContactService with validation and form submission
   - Services handle business logic and data transformations

2. **Phase 2: Custom Hooks** ✅ - Create reusable data fetching hooks
   - Created useNews hook for data fetching with loading/error states
   - Created useNewsArticle hook for single article fetching
   - Created useContactForm hook for form submission
   - All hooks provide consistent error handling patterns

3. **Phase 3: Repository Pattern** ⏳ - Abstract API calls
   - Not yet implemented
   - Will create repository interfaces and implementations
   - Will move API calls from services to repositories

4. **Phase 4: Error Handling** ⏳ - Centralize error handling strategy
   - Not yet implemented
   - Will create custom error types
   - Will centralize error logging and user messaging

5. **Phase 5: Type Safety** ⏳ - Enhance type safety across layers
   - Not yet implemented
   - Will enhance API client with comprehensive types
   - Will add runtime type validation

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
