import type { ContactFormPayload } from '@shared/types';
import type { IContactRepository } from '@/repositories/interfaces';
import { createContactRepository } from '@/repositories/implementations';
import { VALIDATION_CONFIG } from '@/lib/validation-config';
import { MESSAGES } from '@/lib/messages';
import { withErrorHandling } from '.';

export interface ContactFormData extends ContactFormPayload {
  timestamp?: number;
}

export interface ContactResponse {
  message: string;
  success: boolean;
}

export class ContactService {
  private repository: IContactRepository;

  constructor(repository: IContactRepository = createContactRepository()) {
    this.repository = repository;
  }

  async submitContactForm(data: ContactFormPayload): Promise<ContactResponse> {
    return withErrorHandling(
      async () => {
        const formData: ContactFormData = {
          ...data,
          timestamp: Date.now(),
        };

        const response = await this.repository.submitContact(formData);

        return {
          message: response.message || MESSAGES.CONTACT.SEND_SUCCESS,
          success: true,
        };
      },
      MESSAGES.CONTACT.SEND_FAILED
    );
  }

  validateContactForm(data: Partial<ContactFormPayload>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (!data.name || data.name.trim().length < VALIDATION_CONFIG.NAME.MIN_LENGTH) {
      errors.name = VALIDATION_CONFIG.NAME.ERROR_MESSAGE;
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = VALIDATION_CONFIG.EMAIL.ERROR_MESSAGE;
    }
    
    if (!data.message || data.message.trim().length < VALIDATION_CONFIG.MESSAGE.MIN_LENGTH) {
      errors.message = VALIDATION_CONFIG.MESSAGE.ERROR_MESSAGE;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    return VALIDATION_CONFIG.EMAIL.REGEX.test(email);
  }
}

export const contactService = new ContactService();
