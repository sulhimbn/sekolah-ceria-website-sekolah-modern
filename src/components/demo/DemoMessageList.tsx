import { useMemo } from 'react';
import type { User, ChatMessage } from '@shared/types';

interface DemoMessageListProps {
  messages: ChatMessage[];
  users: User[];
  selectedChatId: string;
  isLoading: boolean;
}

export const DemoMessageList = React.memo(function DemoMessageList({
  messages,
  users,
  selectedChatId,
  isLoading,
}: DemoMessageListProps) {
  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  if (isLoading) {
    return (
      <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
        <div className="text-sm text-muted-foreground">Memuat pesan...</div>
      </div>
    );
  }

  if (!selectedChatId) {
    return (
      <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
        <div className="text-sm text-muted-foreground">
          Select a chat to view messages.
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
        <div className="text-sm text-muted-foreground">No messages yet.</div>
      </div>
    );
  }

  return (
    <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
      {messages.map(m => (
        <div key={m.id} className="text-sm mb-2">
          <span className="font-medium">
            {usersById.get(m.userId)?.name ?? 'Unknown'}:
          </span>{' '}
          {m.text}
          <span className="text-xs text-muted-foreground ml-2">
            {new Date(m.ts).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
});
