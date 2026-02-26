/**
 * Zod validation schemas for worker API endpoints
 * Ensures consistency between frontend and backend validation
 */
import { z } from 'zod';

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Nama harus diisi, minimal 2 karakter.').trim(),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid.'),
  message: z.string().min(10, 'Pesan harus diisi, minimal 10 karakter.').trim(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// User creation validation
export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama diperlukan.')
    .trim()
    .max(100, 'Nama terlalu panjang.'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Chat creation validation
export const createChatSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul diperlukan.')
    .trim()
    .max(200, 'Judul terlalu panjang.'),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;

// Message creation validation
export const sendMessageSchema = z.object({
  userId: z.string().min(1, 'User ID diperlukan.'),
  text: z
    .string()
    .min(1, 'Pesan tidak boleh kosong.')
    .trim()
    .max(5000, 'Pesan terlalu panjang.'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

// Delete many validation
export const deleteManySchema = z.object({
  ids: z
    .array(z.string())
    .min(1, 'Minimal satu ID diperlukan.')
    .max(100, 'Terlalu banyak item untuk dihapus.'),
});

export type DeleteManyInput = z.infer<typeof deleteManySchema>;

// Auth validation schemas
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal 6 karakter.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter.')
    .trim()
    .max(100, 'Nama terlalu panjang.'),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid.'),
  password: z.string().min(6, 'Password minimal 6 karakter.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak valid.")
    .trim(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
