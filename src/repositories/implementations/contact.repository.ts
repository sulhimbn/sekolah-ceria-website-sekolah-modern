import { api } from '@/lib/api-client';
import type {
  IContactRepository,
  ContactFormData,
  ContactResponse,
} from '@/repositories/interfaces';

/**
 * API implementation of ContactRepository
 * Submits data to REST API endpoint
 */
export class ContactApiRepository implements IContactRepository {
  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    const response = await api<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return {
      message: response.message,
      success: true,
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
