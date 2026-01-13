import { describe, it, expect } from 'vitest'
import { ContactService } from '@/services/contact.service'
import type { ContactFormPayload } from '@shared/types'

const contactService = new ContactService()

describe('ContactService - Validation Logic', () => {
  describe('validateContactForm', () => {
    it('should validate valid form data', () => {
      const validData: ContactFormPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(validData)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return error when name is missing', () => {
      const invalidData = {
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Nama harus diisi, minimal 2 karakter.')
      expect(result.errors.email).toBeUndefined()
      expect(result.errors.message).toBeUndefined()
    })

    it('should return error when name is too short', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: 'J',
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Nama harus diisi, minimal 2 karakter.')
    })

    it('should return error when name is only whitespace', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: '   ',
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Nama harus diisi, minimal 2 karakter.')
    })

    it('should return error when email is missing', () => {
      const invalidData = {
        name: 'John Doe',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Format email tidak valid.')
      expect(result.errors.name).toBeUndefined()
      expect(result.errors.message).toBeUndefined()
    })

    it('should return error when email format is invalid', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Format email tidak valid.')
    })

    it('should return error for various invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user@.com',
        'user@domain.',
      ]

      invalidEmails.forEach(email => {
        const result = contactService.validateContactForm({
          name: 'John Doe',
          email,
          message: 'This is a valid message with more than 10 characters.',
        })
        expect(result.isValid).toBe(false)
        expect(result.errors.email).toBe('Format email tidak valid.')
      })
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example.co.id',
      ]

      validEmails.forEach(email => {
        const result = contactService.validateContactForm({
          name: 'John Doe',
          email,
          message: 'This is a valid message with more than 10 characters.',
        })
        expect(result.errors.email).toBeUndefined()
      })
    })

    it('should return error when message is missing', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.message).toBe('Pesan harus diisi, minimal 10 karakter.')
      expect(result.errors.name).toBeUndefined()
      expect(result.errors.email).toBeUndefined()
    })

    it('should return error when message is too short', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.message).toBe('Pesan harus diisi, minimal 10 karakter.')
    })

    it('should return error when message is only whitespace', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '          ',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.message).toBe('Pesan harus diisi, minimal 10 karakter.')
    })

    it('should accept message exactly 10 characters long', () => {
      const data: Partial<ContactFormPayload> = {
        name: 'John Doe',
        email: 'john@example.com',
        message: '0123456789',
      }

      const result = contactService.validateContactForm(data)

      expect(result.isValid).toBe(true)
      expect(result.errors.message).toBeUndefined()
    })

    it('should return multiple errors when multiple fields are invalid', () => {
      const invalidData: Partial<ContactFormPayload> = {
        name: 'J',
        email: 'invalid',
        message: 'Short',
      }

      const result = contactService.validateContactForm(invalidData)

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Nama harus diisi, minimal 2 karakter.')
      expect(result.errors.email).toBe('Format email tidak valid.')
      expect(result.errors.message).toBe('Pesan harus diisi, minimal 10 karakter.')
      expect(Object.keys(result.errors)).toHaveLength(3)
    })

    it('should return all errors for empty form', () => {
      const result = contactService.validateContactForm({})

      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Nama harus diisi, minimal 2 karakter.')
      expect(result.errors.email).toBe('Format email tidak valid.')
      expect(result.errors.message).toBe('Pesan harus diisi, minimal 10 karakter.')
    })

    it('should handle boundary case for name (2 characters)', () => {
      const data: Partial<ContactFormPayload> = {
        name: 'AB',
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(data)

      expect(result.isValid).toBe(true)
      expect(result.errors.name).toBeUndefined()
    })

    it('should handle special characters in name', () => {
      const data: Partial<ContactFormPayload> = {
        name: "D'Oconnor",
        email: 'john@example.com',
        message: 'This is a valid message with more than 10 characters.',
      }

      const result = contactService.validateContactForm(data)

      expect(result.isValid).toBe(true)
      expect(result.errors.name).toBeUndefined()
    })
  })
})
