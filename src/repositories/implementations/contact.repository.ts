import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import { schemas } from '@/lib/zod-schemas';
import type {
  IContactRepository,
  ContactFormData,
  ContactResponse,
} from '@/repositories/interfaces';

/**
 * API implementation of ContactRepository
 * Submits data to REST API endpoint
 * Includes runtime validation for API responses
 */
export class ContactApiRepository implements IContactRepository {
  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    const response = await api<{ success: boolean; message: string }>(
      '/api/contact',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // Validate the response and construct the ContactResponse
    const validated = validateResponse(
      schemas.contactResponse,
      { message: response.message, success: response.success },
      'ContactResponse'
    );

    return {
      message: validated.message,
      success: validated.success,
    };
  }
}

/**
 * Factory function to create ContactRepository instance
 * Allows for easy swapping between implementations
 */
export function createContactRepository(): IContactRepository {
  return new ContactApiRepository();
}
