import { useMemo } from 'react';
import type { Message, User } from '@shared/types';

interface MessageListProps {
  messages: Message[];
  users: User[];
  selectedChatId: string;
  isLoading: boolean;
}

export function MessageList({
  messages,
  users,
  selectedChatId,
  isLoading,
}: MessageListProps) {
  const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  return (
    <div className="border rounded p-3 h-64 overflow-y-auto bg-muted/30">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">Memuat pesan...</div>
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
          <div className="text-sm text-muted-foreground">No messages yet.</div>
        )
      ) : (
        <div className="text-sm text-muted-foreground">
          Select a chat to view messages.
        </div>
      )}
    </div>
  );
}
