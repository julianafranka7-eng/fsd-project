import { useGetUsersQuery } from '@/entities/user';
import { Card } from '@/shared/ui/Card';

export function AdminUsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery();

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Users</h1>
      <div className="mt-4 space-y-2">
        {isLoading && <p className="text-sm text-slate-400">Loading...</p>}
        {users.map((user) => (
          <Card key={user.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600">{user.role}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
