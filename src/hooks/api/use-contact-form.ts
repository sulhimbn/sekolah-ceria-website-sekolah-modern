import { useState } from 'react';
import { contactService } from '@/services';
import type { ContactFormPayload } from '@shared/types';

interface UseContactFormReturn {
  isSubmitting: boolean;
  error: string | null;
  submitContactForm: (data: ContactFormPayload) => Promise<void>;
  clearError: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContactForm = async (data: ContactFormPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await contactService.submitContactForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim pesan.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isSubmitting,
    error,
    submitContactForm,
    clearError,
  };
}
