import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Chat } from '@shared/types';

interface ChatManagerProps {
  chats: Chat[];
  selectedChatId: string;
  isLoading: boolean;
  isCreating: boolean;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (title: string) => Promise<Chat | undefined>;
}

export function ChatManager({
  chats,
  selectedChatId,
  isLoading,
  isCreating,
  onSelectChat,
  onCreateChat,
}: ChatManagerProps) {
  const [title, setTitle] = useState('');

  const handleCreateChat = useCallback(async () => {
    if (!title.trim()) return;
    const newChat = await onCreateChat(title.trim());
    if (newChat) {
      setTitle('');
      if (!selectedChatId) onSelectChat(newChat.id);
    }
  }, [title, onCreateChat, selectedChatId, onSelectChat]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="New chat title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isCreating}
        />
        <Button
          onClick={handleCreateChat}
          disabled={isCreating || !title.trim()}
        >
          {isCreating ? '...' : 'Add Chat'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground w-20">Chat</label>
        <select
          className="w-full bg-background border px-2 py-2 rounded"
          value={selectedChatId}
          onChange={e => onSelectChat(e.target.value)}
          disabled={isLoading}
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
  );
}
