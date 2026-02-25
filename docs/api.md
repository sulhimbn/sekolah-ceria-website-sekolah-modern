# API Documentation

This document provides complete API reference for the Sekolah Ceria backend.

## Base URL

```
https://your-worker.your-account.workers.dev
```

For local development:
```
http://localhost:8787
```

---

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Pagination
List endpoints return paginated results:
```json
{
  "items": [...],
  "nextCursor": "cursor_string" | null,
  "hasMore": true | false
}
```

Query parameters:
- `cursor` - Pagination cursor from previous response
- `limit` - Number of items per page (optional, defaults to backend value)

---

## Endpoints

### 1. Test Endpoint

#### GET /api/test

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "CF Workers Demo"
  }
}
```

---

### 2. Users

#### GET /api/users

Retrieve a paginated list of users.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| cursor | string? | Pagination cursor |
| limit | number? | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "name": "John Doe", "createdAt": "timestamp" }
    ],
    "nextCursor": "abc123",
    "hasMore": false
  }
}
```

---

#### POST /api/users

Create a new user.

**Request Body:**
```json
{
  "name": "John Doe"
}
```

**Validation:**
- `name` (required): Must be at least 1 character, trimmed

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "createdAt": "timestamp"
  }
}
```

**Error Responses:**
- `400`: "name required"

---

#### DELETE /api/users/:id

Delete a user by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | User UUID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "deleted": true
  }
}
```

---

#### POST /api/users/deleteMany

Bulk delete users.

**Request Body:**
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Validation:**
- `ids` (required): Array of user UUIDs, must not be empty

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3,
    "ids": ["uuid1", "uuid2", "uuid3"]
  }
}
```

**Error Responses:**
- `400`: "ids required"

---

### 3. Chats

#### GET /api/chats

Retrieve a paginated list of chat boards.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| cursor | string? | Pagination cursor |
| limit | number? | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "uuid", "title": "General Chat", "messages": [] }
    ],
    "nextCursor": "abc123",
    "hasMore": false
  }
}
```

---

#### POST /api/chats

Create a new chat board.

**Request Body:**
```json
{
  "title": "General Chat"
}
```

**Validation:**
- `title` (required): Must be at least 1 character, trimmed

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "title": "General Chat"
  }
}
```

**Error Responses:**
- `400`: "title required"

---

#### DELETE /api/chats/:id

Delete a chat board by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Chat UUID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chat-uuid",
    "deleted": true
  }
}
```

---

#### POST /api/chats/deleteMany

Bulk delete chat boards.

**Request Body:**
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Validation:**
- `ids` (required): Array of chat UUIDs, must not be empty

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3,
    "ids": ["uuid1", "uuid2", "uuid3"]
  }
}
```

**Error Responses:**
- `400`: "ids required"

---

### 4. Messages

#### GET /api/chats/:chatId/messages

Retrieve all messages from a chat board.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| chatId | string | Chat UUID |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "message-uuid",
      "userId": "user-uuid",
      "text": "Hello world",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404`: "chat not found"

---

#### POST /api/chats/:chatId/messages

Send a message to a chat board.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| chatId | string | Chat UUID |

**Request Body:**
```json
{
  "userId": "user-uuid",
  "text": "Hello world"
}
```

**Validation:**
- `userId` (required): Must be a non-empty string
- `text` (required): Must be at least 1 character, trimmed

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "userId": "user-uuid",
    "text": "Hello world",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400`: "userId and text required"
- `404`: "chat not found"

---

### 5. News Articles

#### GET /api/news

Retrieve a list of news articles.

**Query Parameters:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "article-uuid",
        "title": "School Event Announcement",
        "content": "Full article content...",
        "excerpt": "Short excerpt...",
        "image": "url-to-image",
        "date": "25 February 2026",
        "category": "Announcement"
      }
    ],
    "nextCursor": null,
    "hasMore": false
  }
}
```

---

#### GET /api/news/:id

Retrieve a single news article by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Article UUID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "article-uuid",
    "title": "School Event Announcement",
    "content": "Full article content...",
    "excerpt": "Short excerpt...",
    "image": "url-to-image",
    "date": "25 February 2026",
    "category": "Announcement"
  }
}
```

**Error Responses:**
- `404`: "Article not found"

---

### 6. Contact Form

#### POST /api/contact

Submit a contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to inquire about enrollment"
}
```

**Validation:**
| Field | Type | Rules |
|-------|------|-------|
| name | string | Required, minimum 2 characters |
| email | string | Required, valid email format |
| message | string | Required, minimum 10 characters |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Pesan Anda telah berhasil dikirim!"
  }
}
```

**Error Responses:**
- `400`: "Nama harus diisi, minimal 2 karakter." (Name required, min 2 chars)
- `400`: "Format email tidak valid." (Invalid email format)
- `400`: "Pesan harus diisi, minimal 10 karakter." (Message required, min 10 chars)

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Validation failed |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all entity identifiers
- The backend uses Cloudflare Durable Objects for data persistence
- API responses are typed with TypeScript for consistency
