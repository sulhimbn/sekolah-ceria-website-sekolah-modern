import { useEffect, useMemo, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserManager } from './UserManager';
import { ChatManager } from './ChatManager';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
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

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedChatId, setSelectedChatId] = useState<string>('');

  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  // Select first user/chat once data arrives
  useEffect(() => {
    if (!selectedUserId && users.length) setSelectedUserId(users[0].id);
  }, [users, selectedUserId]);

  useEffect(() => {
    if (!selectedChatId && chats.length) setSelectedChatId(chats[0].id);
  }, [chats, selectedChatId]);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId).catch(err => {
        toast.error(err instanceof Error ? err.message : 'Gagal memuat pesan');
      });
    }
  }, [selectedChatId, loadMessages]);

  const handleSendMessage = useCallback(
    async (userId: string, chatId: string, text: string) => {
      const newMessage = await sendMessage(chatId, userId, text);
      if (!newMessage) {
        toast.error('Gagal mengirim pesan');
      }
    },
    [sendMessage]
  );

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
            <UserManager
              users={users}
              selectedUserId={selectedUserId}
              isLoading={isLoadingUsers}
              isCreating={isCreatingUser}
              onSelectUser={setSelectedUserId}
              onCreateUser={createUser}
            />
            <ChatManager
              chats={chats}
              selectedChatId={selectedChatId}
              isLoading={isLoadingChats}
              isCreating={isCreatingChat}
              onSelectChat={setSelectedChatId}
              onCreateChat={createChat}
            />
          </div>

          {/* Messages */}
          <MessageList
            messages={messages}
            users={users}
            selectedChatId={selectedChatId}
            isLoading={isLoadingMessages}
          />

          {/* Compose */}
          <MessageComposer
            selectedUserId={selectedUserId || null}
            selectedChatId={selectedChatId || null}
            isSending={isSending}
            onSendMessage={handleSendMessage}
          />
        </div>

        <footer className="mt-8 text-center text-muted-foreground/80">
          <p>Powered by Cloudflare</p>
        </footer>

        <Toaster richColors closeButton />
      </main>
    </AppLayout>
  );
}
