import { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface MessageComposerProps {
  selectedUserId: string | null;
  selectedChatId: string | null;
  isSending: boolean;
  onSendMessage: (
    userId: string,
    chatId: string,
    text: string
  ) => Promise<void>;
}

export function MessageComposer({
  selectedUserId,
  selectedChatId,
  isSending,
  onSendMessage,
}: MessageComposerProps) {
  const [text, setText] = useState('');

  const handleSend = useCallback(async () => {
    if (!selectedUserId || !selectedChatId || !text.trim()) return;
    await onSendMessage(selectedUserId, selectedChatId, text.trim());
    setText('');
  }, [selectedUserId, selectedChatId, text, onSendMessage]);

  return (
    <div className="flex gap-2">
      <Textarea
        placeholder="Type a message"
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={!selectedUserId || !selectedChatId || isSending}
      />
      <Button
        onClick={handleSend}
        disabled={
          !selectedUserId || !selectedChatId || !text.trim() || isSending
        }
      >
        {isSending ? '...' : 'Send'}
      </Button>
    </div>
  );
}
