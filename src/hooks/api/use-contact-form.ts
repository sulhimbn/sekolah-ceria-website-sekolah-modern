import { useState } from 'react';
import { contactService } from '@/services';
import { useErrorHandler } from '@/useErrorHandler';
import type { ContactFormPayload } from '@shared/types';

interface UseContactFormReturn {
  isSubmitting: boolean;
  error: string | null;
  submitContactForm: (data: ContactFormPayload) => Promise<void>;
  clearError: () => void;
}

export function useContactForm(): UseContactFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, handleError, clearError } = useErrorHandler({
    defaultMessage: 'Gagal mengirim pesan.',
    category: 'user',
  });

  const submitContactForm = async (data: ContactFormPayload) => {
    try {
      setIsSubmitting(true);
      clearError();
      await contactService.submitContactForm(data);
    } catch (err) {
      handleError(err, 'Gagal mengirim pesan.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    submitContactForm,
    clearError,
  };
}
