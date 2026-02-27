import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface DemoMessageComposerProps {
  text: string;
  onTextChange: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
  disabled: boolean;
}

export const DemoMessageComposer = React.memo(function DemoMessageComposer({
  text,
  onTextChange,
  onSend,
  isSending,
  disabled,
}: DemoMessageComposerProps) {
  return (
    <div className="flex gap-2">
      <Textarea
        placeholder="Type a message"
        value={text}
        onChange={e => onTextChange(e.target.value)}
        disabled={disabled || isSending}
      />
      <Button onClick={onSend} disabled={disabled || !text.trim() || isSending}>
        {isSending ? '...' : 'Send'}
      </Button>
    </div>
  );
});
