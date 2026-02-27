import type { Chat } from '@shared/types';

interface DemoChatSelectorProps {
  chats: Chat[];
  selectedChatId: string;
  onSelectChat: (chatId: string) => void;
  isLoading: boolean;
}

export const DemoChatSelector = React.memo(function DemoChatSelector({
  chats,
  selectedChatId,
  onSelectChat,
  isLoading,
}: DemoChatSelectorProps) {
  return (
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
  );
});
