import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { User } from '@shared/types';

interface UserManagerProps {
  users: User[];
  selectedUserId: string;
  isLoading: boolean;
  isCreating: boolean;
  onSelectUser: (userId: string) => void;
  onCreateUser: (name: string) => Promise<User | undefined>;
}

export function UserManager({
  users,
  selectedUserId,
  isLoading,
  isCreating,
  onSelectUser,
  onCreateUser,
}: UserManagerProps) {
  const [name, setName] = useState('');

  const handleCreateUser = useCallback(async () => {
    if (!name.trim()) return;
    const newUser = await onCreateUser(name.trim());
    if (newUser) {
      setName('');
      if (!selectedUserId) onSelectUser(newUser.id);
    }
  }, [name, onCreateUser, selectedUserId, onSelectUser]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="New user name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isCreating}
        />
        <Button
          onClick={handleCreateUser}
          disabled={isCreating || !name.trim()}
        >
          {isCreating ? '...' : 'Add User'}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground w-20">User</label>
        <select
          className="w-full bg-background border px-2 py-2 rounded"
          value={selectedUserId}
          onChange={e => onSelectUser(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
