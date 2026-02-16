import type { ContactFormPayload } from '@shared/types';

export interface ContactFormData extends ContactFormPayload {
  timestamp?: number;
}

export interface ContactResponse {
  message: string;
  success: boolean;
}

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
