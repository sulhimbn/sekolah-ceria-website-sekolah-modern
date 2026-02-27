import type { User } from '@shared/types';

interface DemoUserSelectorProps {
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  isLoading: boolean;
}

export const DemoUserSelector = React.memo(function DemoUserSelector({
  users,
  selectedUserId,
  onSelectUser,
  isLoading,
}: DemoUserSelectorProps) {
  return (
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
  );
});
