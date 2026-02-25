import { useState } from 'react';
import { contactService } from '@/services';
import { errorReporter } from '@/lib/errorReporter';
import type { ContactFormPayload } from '@shared/types';
import type { ApiMutationHookResult } from './index';

type UseContactFormReturn = ApiMutationHookResult<ContactFormPayload, void> & {
  /** Backward compatible alias for submit */
  submitContactForm: (data: ContactFormPayload) => Promise<void>;
};

export function useContactForm(): UseContactFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: ContactFormPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await contactService.submitContactForm(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal mengirim pesan.';
      setError(errorMessage);
      errorReporter.report({
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        level: 'error',
        category: 'user',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitContactForm = async (data: ContactFormPayload) => {
    await submit(data);
  };

  const clearError = () => setError(null);

  return {
    isSubmitting,
    error,
    submit,
    submitContactForm,
    clearError,
  };
}
