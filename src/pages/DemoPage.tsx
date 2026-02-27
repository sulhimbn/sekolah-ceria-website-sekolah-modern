import { useEffect, useMemo, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
import type { User } from '@shared/types';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUsers } from '@/hooks/api/use-users';
import { useChats } from '@/hooks/api/use-chats';
import { useChatMessages } from '@/hooks/api/use-chat-messages';

export function DemoPage() {
  // Use custom hooks instead of direct API calls (HARDEN-001 fix)
  const {
    users,
    isLoading: isLoadingUsers,
    createUser,
    isCreating: isCreatingUser,
  } = useUsers();
  const {
    chats,
    isLoading: isLoadingChats,
    createChat,
    isCreating: isCreatingChat,
  } = useChats();
  const {
    messages,
    isLoading: isLoadingMessages,
    loadMessages,
    sendMessage,
    isSending,
  } = useChatMessages();

  const [selectedUserId, chooseUserId] = useState<string>('');
  const [selectedChatId, chooseChatId] = useState<string>('');
  const [name, updateName] = useState('');
  const [title, updateTitle] = useState('');
  const [text, updateText] = useState('');

  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  // Select first user/chat once data arrives
  useEffect(() => {
    if (!selectedUserId && users.length) chooseUserId(users[0].id);
  }, [users, selectedUserId]);

  useEffect(() => {
    if (!selectedChatId && chats.length) chooseChatId(chats[0].id);
  }, [chats, selectedChatId]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId).catch(err => {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat pesan');
      });
    }
  }, [selectedChatId, loadMessages]);

  const handleCreateUser = useCallback(async () => {
    if (!name.trim()) return;
    const newUser = await createUser(name.trim());
    if (newUser) {
      updateName('');
      toast.success('User created');
      if (!selectedUserId) chooseUserId(newUser.id);
    }
  }, [name, createUser, selectedUserId]);

  const handleCreateChat = useCallback(async () => {
    if (!title.trim()) return;
    const newChat = await createChat(title.trim());
    if (newChat) {
      updateTitle('');
      toast.success('Chat created');
      if (!selectedChatId) chooseChatId(newChat.id);
    }
  }, [title, createChat, selectedChatId]);

  const handleSendMessage = useCallback(async () => {
    if (!selectedUserId || !selectedChatId || !text.trim()) return;
    const newMessage = await sendMessage(
      selectedChatId,
      selectedUserId,
      text.trim()
    );
    if (newMessage) {
      updateText('');
    } else {
      toast.error('Gagal mengirim pesan');
    }
  }, [selectedUserId, selectedChatId, text, sendMessage]);

  const isLoading = isLoadingUsers || isLoadingChats;

  return (
    <AppLayout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">
        <ThemeToggle />

        <div className="absolute inset-0 bg-gradient-rainbow opacity-10 dark:opacity-20" />

        <div className="space-y-6 relative z-10 max-w-3xl w-full">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary floating">
              <Sparkles className="w-8 h-8 text-white rotating" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-center">
            Minimal Users + Chats Demo
          </h1>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Memuat data...
            </div>
          )}

          {/* Quick create controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="New user name"
                value={name}
                onChange={e => updateName(e.target.value)}
                disabled={isCreatingUser}
              />
              <Button
                onClick={handleCreateUser}
                disabled={isCreatingUser || !name.trim()}
              >
                {isCreatingUser ? '...' : 'Add User'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New chat title"
                value={title}
                onChange={e => updateTitle(e.target.value)}
                disabled={isCreatingChat}
              />
              <Button
                onClick={handleCreateChat}
                disabled={isCreatingChat || !title.trim()}
              >
                {isCreatingChat ? '...' : 'Add Chat'}
              </Button>
            </div>
          </div>

          {/* Pick user and chat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground w-20">User</label>
              <select
                className="w-full bg-background border px-2 py-2 rounded"
                value={selectedUserId}
                onChange={e => chooseUserId(e.target.value)}
                disabled={isLoadingUsers}
              >
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground w-20">Chat</label>
              <select
                className="w-full bg-background border px-2 py-2 rounded"
                value={selectedChatId}
                onChange={e => chooseChatId(e.target.value)}
                disabled={isLoadingChats}
              >
                <option value="">Select a chat</option>
                {chats.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
            {isLoadingMessages ? (
              <div className="text-sm text-muted-foreground">
                Memuat pesan...
              </div>
            ) : selectedChatId ? (
              messages.length ? (
                messages.map(m => (
                  <div key={m.id} className="text-sm mb-2">
                    <span className="font-medium">
                      {usersById.get(m.userId)?.name ?? 'Unknown'}:
                    </span>{' '}
                    {m.text}
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(m.ts).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No messages yet.
                </div>
              )
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a chat to view messages.
              </div>
            )}
          </div>

          {/* Compose */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message"
              value={text}
              onChange={e => updateText(e.target.value)}
              disabled={!selectedUserId || !selectedChatId || isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={
                !selectedUserId || !selectedChatId || !text.trim() || isSending
              }
            >
              {isSending ? '...' : 'Send'}
            </Button>
          </div>
        </div>

        <footer className="mt-8 text-center text-muted-foreground/80">
          <p>Powered by Cloudflare</p>
        </footer>

        <Toaster richColors closeButton />
      </main>
    </AppLayout>
  );
}
