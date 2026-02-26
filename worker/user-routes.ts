import { Hono } from 'hono';
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, NewsArticleEntity } from './entities';
import { ok, bad, notFound } from './core-utils';
import {
  contactFormSchema,
  createUserSchema,
  createChatSchema,
  sendMessageSchema,
  deleteManySchema,
  loginSchema,
  registerSchema,
  newsletterSchema,
} from './validators';
import {
  authMiddleware,
  generateAuthResponse,
  requireAuth,
  requireRole,
  type UserRole,
  hashPassword,
  verifyPassword,
} from './auth';

// Maximum limit for list endpoints to prevent DoS via large page sizes
const MAX_LIMIT = 100;

/** Parse and validate limit query parameter with upper bound */
function parseLimit(lq: string | null): number | undefined {
  if (!lq) return undefined;
  const parsed = Math.max(1, Number(lq) | 0);
  return Math.min(parsed, MAX_LIMIT);
}

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH - Public routes
  app.post('/api/auth/register', async c => {
    const body = await c.req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    const { name, email, password } = result.data;
    const userId = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    await UserEntity.create(c.env, {
      id: userId,
      name,
      email,
      password: hashedPassword,
    });
    return ok(c, await generateAuthResponse(c, userId, name, 'user'));
  });

  app.post('/api/auth/login', async c => {
    const body = await c.req.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }
    const { email, password } = result.data;
    const user = await UserEntity.findByEmail(c.env, email);
    if (!user) return bad(c, 'Email atau password salah');
    const passwordValid = await verifyPassword(password, user.password || '');
    if (!passwordValid) return bad(c, 'Email atau password salah');
    return ok(
      c,
      await generateAuthResponse(
        c,
        user.id,
        user.name,
        (user.role as UserRole) || 'user'
      )
    );
  });

  app.get('/api/auth/me', authMiddleware, c => ok(c, requireAuth(c)));

  app.get('/api/test', c =>
    c.json({ success: true, data: { name: 'CF Workers Demo' } })
  );

  // USERS
  app.get('/api/users', async c => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const limit = parseLimit(lq);
    const page = await UserEntity.list(c.env, cq ?? null, limit);
    return ok(c, page);
  });

  app.post('/api/users', async c => {
    const body = await c.req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { name } = result.data;
    return ok(
      c,
      await UserEntity.create(c.env, { id: crypto.randomUUID(), name })
    );
  });

  // CHATS
  app.get('/api/chats', async c => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const limit = parseLimit(lq);
    const page = await ChatBoardEntity.list(c.env, cq ?? null, limit);
    return ok(c, page);
  });

  app.post('/api/chats', async c => {
    const body = await c.req.json();
    const result = createChatSchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { title } = result.data;
    const created = await ChatBoardEntity.create(c.env, {
      id: crypto.randomUUID(),
      title,
      messages: [],
    });
    return ok(c, { id: created.id, title: created.title });
  });

  // MESSAGES
  app.get('/api/chats/:chatId/messages', async c => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!(await chat.exists())) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });

  app.post('/api/chats/:chatId/messages', async c => {
    const chatId = c.req.param('chatId');
    const body = await c.req.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { userId, text } = result.data;
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!(await chat.exists())) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text));
  });

  // NEWS ARTICLES
  app.get('/api/news', async c => {
    await NewsArticleEntity.ensureSeed(c.env);
    const page = await NewsArticleEntity.list(c.env);
    // Sort by date descending
    page.items.reverse();
    return ok(c, page);
  });

  app.get('/api/news/:id', async c => {
    const { id } = c.req.param();
    const article = new NewsArticleEntity(c.env, id);
    if (!(await article.exists())) {
      return notFound(c, 'Article not found');
    }
    return ok(c, await article.getState());
  });

  // CONTACT FORM
  app.post('/api/contact', async c => {
    const body = await c.req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    return ok(c, {
      success: true,
      message: 'Pesan Anda telah berhasil dikirim!',
    });
  });

  // DELETE: Users (admin only)
  app.delete('/api/users/:id', async c => {
    requireRole(c, 'admin');
    return ok(c, {
      id: c.req.param('id'),
      deleted: await UserEntity.delete(c.env, c.req.param('id')),
    });
  });

  app.post('/api/users/deleteMany', async c => {
    requireRole(c, 'admin');
    const body = await c.req.json();
    const result = deleteManySchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { ids } = result.data;
    return ok(c, {
      deletedCount: await UserEntity.deleteMany(c.env, ids),
      ids,
    });
  });

  // DELETE: Chats (admin only)
  app.delete('/api/chats/:id', async c => {
    requireRole(c, 'admin');
    return ok(c, {
      id: c.req.param('id'),
      deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')),
    });
  });

  app.post('/api/chats/deleteMany', async c => {
    requireRole(c, 'admin');
    const body = await c.req.json();
    const result = deleteManySchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { ids } = result.data;
    return ok(c, {
      deletedCount: await ChatBoardEntity.deleteMany(c.env, ids),
      ids,
    });
  });

  // NEWSLETTER SUBSCRIPTION
  app.post('/api/newsletter', async c => {
    const body = await c.req.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return bad(c, result.error.errors[0]?.message || 'Validasi gagal');
    }

    const { email } = result.data;

    // For demo purposes, just return success
    // In production, this would store to a database or send to email service
    console.log(`[NEWSLETTER] New subscription: ${email}`);

    return ok(c, { message: 'Terima kasih telah berlangganan!' });
  });
}
