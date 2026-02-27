import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DemoQuickCreateProps {
  name: string;
  title: string;
  onNameChange: (name: string) => void;
  onTitleChange: (title: string) => void;
  onCreateUser: () => void;
  onCreateChat: () => void;
  isCreatingUser: boolean;
  isCreatingChat: boolean;
}

export const DemoQuickCreate = React.memo(function DemoQuickCreate({
  name,
  title,
  onNameChange,
  onTitleChange,
  onCreateUser,
  onCreateChat,
  isCreatingUser,
  isCreatingChat,
}: DemoQuickCreateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="New user name"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          disabled={isCreatingUser}
        />
        <Button
          onClick={onCreateUser}
          disabled={isCreatingUser || !name.trim()}
        >
          {isCreatingUser ? '...' : 'Add User'}
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New chat title"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isCreatingChat}
        />
        <Button
          onClick={onCreateChat}
          disabled={isCreatingChat || !title.trim()}
        >
          {isCreatingChat ? '...' : 'Add Chat'}
        </Button>
      </div>
    </div>
  );
});
