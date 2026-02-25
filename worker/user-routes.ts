import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, NewsArticleEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { 
  contactFormSchema, 
  createUserSchema, 
  createChatSchema, 
  sendMessageSchema,
  deleteManySchema 
} from "./validators";

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));

  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });

  app.post('/api/users', async (c) => {
    const body = await c.req.json();
    const result = createUserSchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    const { name } = result.data;
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name }));
  });

  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });

  app.post('/api/chats', async (c) => {
    const body = await c.req.json();
    const result = createChatSchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    const { title } = result.data;
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title, messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });

  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });

  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const body = await c.req.json();
    const result = sendMessageSchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    const { userId, text } = result.data;
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text));
  });

  // NEWS ARTICLES
  app.get('/api/news', async (c) => {
    await NewsArticleEntity.ensureSeed(c.env);
    const page = await NewsArticleEntity.list(c.env);
    // Sort by date descending, assuming date is in a sortable format.
    // For "DD MMMM YYYY", we need to parse it. A simpler approach for now is to reverse the seeded array order.
    page.items.reverse();
    return ok(c, page);
  });

  app.get('/api/news/:id', async (c) => {
    const { id } = c.req.param();
    const article = new NewsArticleEntity(c.env, id);
    if (!(await article.exists())) {
      return notFound(c, 'Article not found');
    }
    return ok(c, await article.getState());
  });

  // CONTACT FORM
  app.post('/api/contact', async (c) => {
    const body = await c.req.json();
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    return ok(c, { message: 'Pesan Anda telah berhasil dikirim!' });
  });

  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));

  app.post('/api/users/deleteMany', async (c) => {
    const body = await c.req.json();
    const result = deleteManySchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    const { ids } = result.data;
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, ids), ids });
  });

  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));

  app.post('/api/chats/deleteMany', async (c) => {
    const body = await c.req.json();
    const result = deleteManySchema.safeParse(body);
    
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    
    const { ids } = result.data;
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, ids), ids });
  });
}
