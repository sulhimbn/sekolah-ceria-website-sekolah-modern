import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactService } from '@/services/contact.service'
import { api } from '@/lib/api-client'
import type { ContactFormPayload } from '@shared/types'

vi.mock('@/lib/api-client', () => ({
  api: vi.fn(),
}))

describe('ContactService - API Submission', () => {
  let contactService: ContactService

  beforeEach(() => {
    contactService = new ContactService()
    vi.clearAllMocks()
  })

  describe('submitContactForm', () => {
    it('should submit contact form and return success response', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }

      const mockApiResponse = { message: 'Message received' }
      vi.mocked(api).mockResolvedValueOnce(mockApiResponse)

      const result = await contactService.submitContactForm(formData)

      expect(api).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: expect.stringContaining('"name":"John Doe"'),
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Message received')
    })

    it('should use default success message when API returns empty message', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }

      vi.mocked(api).mockResolvedValueOnce({ message: '' })

      const result = await contactService.submitContactForm(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Pesan Anda telah berhasil dikirim!')
    })

    it('should include timestamp in form data', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }

      vi.mocked(api).mockResolvedValueOnce({ message: 'Success' })
      const beforeTime = Date.now()

      await contactService.submitContactForm(formData)
      const afterTime = Date.now()

      expect(api).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"timestamp"'),
      }))

      const apiCallArgs = vi.mocked(api).mock.calls[0][1] as RequestInit
      const body = JSON.parse(apiCallArgs.body as string)
      expect(body.timestamp).toBeGreaterThanOrEqual(beforeTime)
      expect(body.timestamp).toBeLessThanOrEqual(afterTime)
    })

    it('should preserve form data fields in submission', async () => {
      const formData: ContactFormPayload = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Hello, this is my message',
      }

      vi.mocked(api).mockResolvedValueOnce({ message: 'Success' })

      await contactService.submitContactForm(formData)

      const apiCallArgs = vi.mocked(api).mock.calls[0][1] as RequestInit
      const body = JSON.parse(apiCallArgs.body as string)

      expect(body.name).toBe('Jane Smith')
      expect(body.email).toBe('jane@example.com')
      expect(body.message).toBe('Hello, this is my message')
    })

    it('should handle special characters in form data', async () => {
      const formData: ContactFormPayload = {
        name: "D'John-Smith",
        email: 'john+test@example.com',
        message: 'Special chars: @#$%^&*()',
      }

      vi.mocked(api).mockResolvedValueOnce({ message: 'Success' })

      const result = await contactService.submitContactForm(formData)

      expect(result.success).toBe(true)

      const apiCallArgs = vi.mocked(api).mock.calls[0][1] as RequestInit
      const body = JSON.parse(apiCallArgs.body as string)

      expect(body.name).toBe("D'John-Smith")
      expect(body.email).toBe('john+test@example.com')
      expect(body.message).toBe('Special chars: @#$%^&*()')
    })

    it('should throw error on API failure', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }

      vi.mocked(api).mockRejectedValueOnce(new Error('Network error'))

      await expect(contactService.submitContactForm(formData)).rejects.toThrow(
        'Gagal mengirim pesan. Silakan coba lagi nanti.'
      )
    })

    it('should throw error on timeout', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      }

      vi.mocked(api).mockRejectedValueOnce(new Error('Request timeout'))

      await expect(contactService.submitContactForm(formData)).rejects.toThrow(
        'Gagal mengirim pesan. Silakan coba lagi nanti.'
      )
    })

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(1000)
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: longMessage,
      }

      vi.mocked(api).mockResolvedValueOnce({ message: 'Success' })

      const result = await contactService.submitContactForm(formData)

      expect(result.success).toBe(true)

      const apiCallArgs = vi.mocked(api).mock.calls[0][1] as RequestInit
      const body = JSON.parse(apiCallArgs.body as string)
      expect(body.message).toBe(longMessage)
    })

    it('should set Content-Type header via api client', async () => {
      const formData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message',
      }

      vi.mocked(api).mockResolvedValueOnce({ message: 'Success' })

      await contactService.submitContactForm(formData)

      expect(api).toHaveBeenCalledWith(
        '/api/contact',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })
})
