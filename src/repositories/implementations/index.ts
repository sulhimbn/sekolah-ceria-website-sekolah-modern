/**
 * Barrel export for repository implementations
 *
 * Import pattern:
 * import { createNewsRepository, createContactRepository } from '@/repositories/implementations';
 */
export { NewsApiRepository, createNewsRepository } from './news.repository';
export {
  ContactApiRepository,
  createContactRepository,
} from './contact.repository';
export { UserApiRepository, createUserRepository } from './user.repository';
export { ChatApiRepository, createChatRepository } from './chat.repository';
