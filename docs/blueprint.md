# Sekolah Ceria - Architecture Blueprint

## Current Architecture

### Frontend Structure

src/
├── assets/           # Static assets (images, logos)
├── components/      # React components
│   ├── layout/      # Layout components (Header, Footer, MainLayout, AppLayout)
│   ├── ui/          # ShadCN UI components
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── card.test.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── input.test.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   └── tooltip.tsx
│   ├── ErrorBoundary.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── ErrorFallback.tsx
│   ├── PageLoader.tsx
│   ├── PlaceholderImage.tsx
│   ├── RouteErrorBoundary.tsx
│   ├── ThemeToggle.tsx
│   └── app-sidebar.tsx
├── hooks/          # Custom hooks
│   ├── api/        # API-related hooks
│   │   ├── use-news.ts
│   │   ├── use-news-article.ts
│   │   ├── use-contact-form.ts
│   │   ├── use-users.ts
│   │   ├── use-chats.ts
│   │   ├── use-chat-messages.ts
│   │   └── index.ts
│   ├── use-theme.ts
│   ├── use-mobile.tsx
│   ├── useErrorHandler.ts
│   └── useSkeletonLoader.tsx
├── i18n/            # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── id.json
├── lib/            # Utilities
│   ├── api-client.ts       # API client
│   ├── api-validator.ts    # Runtime validation with Zod
│   ├── api-validator.test.ts # Validator tests
│   ├── errorReporter.ts    # Error reporting
│   ├── feature-flags.ts    # Feature toggle configuration
│   ├── messages.ts         # Centralized error messages
│   ├── mock-data.ts        # Demo data
│   ├── utils.ts
│   ├── validation-config.ts # Validation constants
│   └── zod-schemas.ts      # Zod validation schemas
├── pages/          # Page components
│   ├── AboutPage.tsx
│   ├── AcademicsPage.tsx
│   ├── AdmissionsPage.tsx
│   ├── ContactPage.tsx
│   ├── DemoPage.tsx
│   ├── HomePage.tsx
│   ├── NewsDetailPage.tsx
│   ├── NewsPage.tsx
│   ├── NotFoundPage.tsx
│   └── ServerErrorPage.tsx
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
├── services/       # Business logic services
│   ├── news.service.ts           # News operations
│   ├── news.service.pure.test.ts # News service tests
│   ├── news.service.api.test.ts  # API integration tests
│   ├── contact.service.ts        # Contact operations
│   ├── contact.service.validation.test.ts
│   ├── contact.service.api.test.ts
│   ├── user.service.ts           # User operations
│   ├── chat.service.ts          # Chat operations
│   ├── semantic-search.service.ts # AI semantic search
│   └── index.ts
├── test/           # Test utilities
│   └── setup.ts
├── App.css
├── index.css
├── main.tsx
└── vite-env.d.ts
src/
├── assets/           # Static assets (images, logos)
├── components/      # React components (UI + Layout)
│   ├── layout/      # Layout components
│   │   ├── Header.tsx, Footer.tsx, MainLayout.tsx, AppLayout.tsx
│   │   ├── ErrorBoundary.tsx, ErrorFallback.tsx, RouteErrorBoundary.tsx
│   │   ├── ThemeToggle.tsx, PageLoader.tsx, PlaceholderImage.tsx
│   │   └── app-sidebar.tsx
│   └── ui/          # ShadCN UI components (60+)
├── hooks/          # Custom hooks
│   ├── api/        # API-related hooks
│   │   ├── use-news.ts
│   │   ├── use-news-article.ts
│   │   ├── use-contact-form.ts
│   │   ├── use-users.ts
│   │   ├── use-chats.ts
│   │   ├── use-chat-messages.ts
│   │   └── index.ts
│   ├── ui/         # UI-related hooks
│   │   ├── use-theme.ts
│   │   └── use-mobile.tsx
│   └── useErrorHandler.ts # Global error handling hook
├── i18n/            # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── id.json
├── lib/            # Utilities
│   ├── api-client.ts       # API client
│   ├── api-validator.ts    # Runtime validation with Zod
│   ├── api-validator.test.ts # Validator tests
│   ├── error-reporter.ts   # Error reporting
│   ├── feature-flags.ts    # Feature toggle configuration
│   ├── messages.ts         # Centralized error messages
│   ├── mock-data.ts        # Demo data
│   ├── utils.ts
│   ├── validation-config.ts # Validation constants
│   └── zod-schemas.ts      # Zod validation schemas
├── pages/          # Page components
│   ├── AboutPage.tsx
│   ├── AcademicsPage.tsx
│   ├── AdmissionsPage.tsx
│   ├── ContactPage.tsx
│   ├── DemoPage.tsx
│   ├── HomePage.tsx
│   ├── NewsDetailPage.tsx
│   ├── NewsPage.tsx
│   ├── NotFoundPage.tsx
│   └── ServerErrorPage.tsx
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
├── services/       # Business logic services
│   ├── news.service.ts           # News operations
│   ├── news.service.pure.test.ts # News service tests
│   ├── news.service.api.test.ts  # API integration tests
│   ├── contact.service.ts        # Contact operations
│   ├── contact.service.validation.test.ts
│   ├── contact.service.api.test.ts
│   ├── user.service.ts           # User operations
│   ├── chat.service.ts          # Chat operations
│   ├── semantic-search.service.ts # AI semantic search
│   └── index.ts
├── test/           # Test utilities
│   └── setup.ts
├── App.css
├── index.css
├── main.tsx
└── vite-env.d.ts
```

### Backend Structure

```
worker/
├── index.ts        # Worker entry point (Hono app setup)
├── user-routes.ts  # API route definitions (all routes in single file)
├── core-utils.ts   # Durable Object utilities (Entity, Index base classes)
├── entities.ts     # Entity implementations (User, Chat, News)
└── validators.ts  # Request validation schemas (Zod)
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

### Current Backend Structure (Flat - No Subdirectories)

```
worker/
├── index.ts        # Worker entry point
├── user-routes.ts  # API route definitions (all routes in single file)
├── core-utils.ts   # Durable Object utilities
├── entities.ts     # Entity implementations (User, Chat, News)
└── validators.ts   # Request validation schemas (Zod)
```

## Key Patterns Implemented

### 1. Repository Pattern ✅

- Abstract data access behind interfaces
- Centralize API call logic
- Enable easy mocking for tests

### 2. Service Layer ✅

- Encapsulate business rules
- Coordinate between multiple repositories
- Handle data transformations

### 3. Custom Hooks for Data Fetching ✅

- Reuse loading/error/success patterns
- Encapsulate API calls with proper error handling
- Provide typed responses

### 4. Dependency Inversion ✅

- Depend on abstractions (interfaces) not implementations
- Use factory functions for creating services
- Make components testable

### 5. Single Responsibility ✅

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
   - useErrorHandler: global error handling hook
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
