import type {
  ContactFormPayload,
  ContactFormData,
  ContactResponse,
} from '@shared/types';

/**
 * Repository interface for contact form submissions
 * Abstracts data source (API, email service, etc.)
 */

/**
 * Repository interface for contact form submissions
 * Abstracts data source (API, email service, etc.)
 */
export interface IContactRepository {
  /**
   * Submit contact form data
   * @param data - Form data with optional timestamp
   * @returns Promise resolving to submission response
   * @throws Error if submission fails
   */
  submitContact(data: ContactFormData): Promise<ContactResponse>;
}
