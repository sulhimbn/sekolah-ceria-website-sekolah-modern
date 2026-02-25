/**
 * API Response Validation Utilities
 *
 * Provides runtime validation for API responses using Zod schemas.
 * This ensures that API responses match the expected structure,
 * catching schema mismatches early before they cause runtime errors.
 *
 * Usage:
 *   import { validateResponse } from '@/lib/api-validator';
 *   import { schemas } from '@/lib/zod-schemas';
 *
 *   const data = await api<UserListResponse>('/api/users');
 *   const validated = validateResponse(schemas.userListResponse, data);
 */
import { z } from 'zod';
import { MESSAGES } from './messages';

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly schemaName: string,
    public readonly issues: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates raw data against a Zod schema
 *
 * @param schema - The Zod schema to validate against
 * @param data - The raw data to validate
 * @param schemaName - Optional name for error reporting
 * @returns The validated data (typed according to the schema)
 * @throws ValidationError if validation fails
 */
export function validateResponse<T extends z.ZodType>(
  schema: T,
  data: unknown,
  schemaName?: string
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map(issue => {
        const path = issue.path.join('.');
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join('; ');

    throw new ValidationError(
      `API response validation failed: ${errorMessage}`,
      schemaName || 'unknown',
      result.error.issues
    );
  }

  return result.data;
}

/**
 * Validates an API response with a fallback
 *
 * @param schema - The Zod schema to validate against
 * @param data - The raw data to validate
 * @param fallback - Fallback value if validation fails
 * @param schemaName - Optional name for error reporting
 * @returns The validated data or fallback value
 */
export function validateResponseSafe<T extends z.ZodType>(
  schema: T,
  data: unknown,
  fallback: z.infer<T>,
  schemaName?: string
): z.infer<T> {
  try {
    return validateResponse(schema, data, schemaName);
  } catch (error) {
    console.error(
      `[API Validator] Validation failed for ${schemaName || 'unknown'}:`,
      error instanceof ValidationError ? error.issues : error
    );
    return fallback;
  }
}

/**
 * Validates an array of items
 *
 * @param schema - The Zod schema for each item
 * @param data - The raw array data to validate
 * @param schemaName - Optional name for error reporting
 * @returns The validated array
 * @throws ValidationError if validation fails
 */
export function validateArray<T extends z.ZodType>(
  schema: T,
  data: unknown,
  schemaName?: string
): z.infer<T>[] {
  if (!Array.isArray(data)) {
    throw new ValidationError(
      `Expected array but received ${typeof data}`,
      schemaName || 'array',
      []
    );
  }

  return data.map((item, index) =>
    validateResponse(schema, item, `${schemaName}[${index}]`)
  );
}

/**
 * Creates a validator function for a specific schema
 *
 * @param schema - The Zod schema to validate against
 * @param schemaName - Optional name for error reporting
 * @returns A function that validates data against the schema
 *
 * @example
 *   const validateUser = createValidator(schemas.user, 'User');
 *   const user = validateUser(rawData);
 */
export function createValidator<T extends z.ZodType>(
  schema: T,
  schemaName?: string
): (data: unknown) => z.infer<T> {
  return (data: unknown) => validateResponse(schema, data, schemaName);
}
