import { useEffect, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
import { AppLayout } from '@/components/layout/AppLayout';
import { useUsers } from '@/hooks/api/use-users';
import { useChats } from '@/hooks/api/use-chats';
import { useChatMessages } from '@/hooks/api/use-chat-messages';
import {
  DemoUserSelector,
  DemoChatSelector,
  DemoMessageList,
  DemoMessageComposer,
  DemoQuickCreate,
} from '@/components/demo';

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

  const [selectedUserId, chooseUserId] = useState('');
  const [selectedChatId, chooseChatId] = useState('');
  const [name, updateName] = useState('');
  const [title, updateTitle] = useState('');
  const [text, updateText] = useState('');

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
      <main
        id="main-content"
        role="main"
        className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative"
      >
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
          <DemoQuickCreate
            name={name}
            title={title}
            onNameChange={updateName}
            onTitleChange={updateTitle}
            onCreateUser={handleCreateUser}
            onCreateChat={handleCreateChat}
            isCreatingUser={isCreatingUser}
            isCreatingChat={isCreatingChat}
          />

          {/* Pick user and chat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DemoUserSelector
              users={users}
              selectedUserId={selectedUserId}
              onSelectUser={chooseUserId}
              isLoading={isLoadingUsers}
            />
            <DemoChatSelector
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={chooseChatId}
              isLoading={isLoadingChats}
            />
          </div>

          {/* Messages */}
          <DemoMessageList
            messages={messages}
            users={users}
            selectedChatId={selectedChatId}
            isLoading={isLoadingMessages}
          />

          {/* Compose */}
          <DemoMessageComposer
            text={text}
            onTextChange={updateText}
            onSend={handleSendMessage}
            isSending={isSending}
            disabled={!selectedUserId || !selectedChatId}
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
