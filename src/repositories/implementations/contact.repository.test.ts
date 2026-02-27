import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactApiRepository } from './contact.repository';
import { api } from '@/lib/api-client';
import { validateResponse } from '@/lib/api-validator';
import type { ContactFormData, ContactResponse } from '@shared/types';

// Mock the api-client module
vi.mock('@/lib/api-client', () => ({
  api: vi.fn(),
}));

// Mock the api-validator module
vi.mock('@/lib/api-validator', () => ({
  validateResponse: vi.fn((schema, data, schemaName) => data),
}));

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: '',
}));

describe('ContactApiRepository', () => {
  let repository: ContactApiRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new ContactApiRepository();
  });

  describe('submitContact', () => {
    it('should submit contact form and return validated response', async () => {
      const mockFormData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message',
        timestamp: Date.now(),
      };
      const mockApiResponse = {
        success: true,
        message: 'Message sent successfully',
      };
      const mockValidatedResponse = {
        success: true,
        message: 'Message sent successfully',
      };
      const expectedResponse: ContactResponse = {
        success: true,
        message: 'Message sent successfully',
      };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockApiResponse);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockValidatedResponse
      );

      const result = await repository.submitContact(mockFormData);

      expect(api).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: JSON.stringify(mockFormData),
      });
      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        { message: 'Message sent successfully', success: true },
        'ContactResponse'
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should submit contact form without timestamp', async () => {
      const mockFormData: ContactFormData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Another message',
      };
      const mockApiResponse = { success: true, message: 'Message sent' };
      const mockValidatedResponse = { success: true, message: 'Message sent' };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockApiResponse);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockValidatedResponse
      );

      const result = await repository.submitContact(mockFormData);

      expect(api).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: JSON.stringify(mockFormData),
      });
      expect(result).toEqual({ success: true, message: 'Message sent' });
    });

    it('should throw error when submission fails', async () => {
      const mockFormData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello',
      };

      (api as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Server error')
      );

      await expect(repository.submitContact(mockFormData)).rejects.toThrow(
        'Server error'
      );
    });

    it('should handle failure response from API', async () => {
      const mockFormData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello',
      };
      const mockApiResponse = {
        success: false,
        message: 'Failed to send message',
      };
      const mockValidatedResponse = {
        success: false,
        message: 'Failed to send message',
      };

      (api as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockApiResponse);
      (validateResponse as ReturnType<typeof vi.fn>).mockReturnValueOnce(
        mockValidatedResponse
      );

      const result = await repository.submitContact(mockFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to send message');
    });
  });
});
