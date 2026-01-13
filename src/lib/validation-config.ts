export const VALIDATION_CONFIG = {
  NAME: {
    MIN_LENGTH: 2,
    ERROR_MESSAGE: 'Nama harus diisi, minimal 2 karakter.',
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ERROR_MESSAGE: 'Format email tidak valid.',
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    ERROR_MESSAGE: 'Pesan harus diisi, minimal 10 karakter.',
  },
  NEWS: {
    DEFAULT_RECENT_COUNT: 3,
  },
} as const;
