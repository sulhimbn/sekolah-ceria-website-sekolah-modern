import type { ContactFormPayload } from '@shared/types';
import { api } from '@/lib/api-client';

export interface ContactFormData extends ContactFormPayload {
  timestamp?: number;
}

export interface ContactResponse {
  message: string;
  success: boolean;
}

class ContactService {
  async submitContactForm(data: ContactFormPayload): Promise<ContactResponse> {
    try {
      const formData: ContactFormData = {
        ...data,
        timestamp: Date.now(),
      };
      
      const response = await api<{ message: string }>('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      return {
        message: response.message || 'Pesan Anda telah berhasil dikirim!',
        success: true,
      };
    } catch (error) {
      throw new Error('Gagal mengirim pesan. Silakan coba lagi nanti.');
    }
  }

  validateContactForm(data: Partial<ContactFormPayload>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Nama harus diisi, minimal 2 karakter.';
    }
    
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Format email tidak valid.';
    }
    
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Pesan harus diisi, minimal 10 karakter.';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const contactService = new ContactService();
