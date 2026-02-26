export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
}

export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// Tipe untuk artikel berita Sekolah Ceria
export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl?: string;
}
// Tipe untuk payload formulir kontak
export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

// Tipe untuk data formulir kontak dengan timestamp
export interface ContactFormData extends ContactFormPayload {
  timestamp?: number;
}

// Tipe untuk respons submission formulir kontak
export interface ContactResponse {
  message: string;
  success: boolean;
}
